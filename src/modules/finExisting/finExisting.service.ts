import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FinExistingDisbursement } from 'src/entities/fin-existing-disbursement.entity';
import { FinExisting } from 'src/entities/fin-existing.entity';
import { FinExistingRepayment } from 'src/entities/fin-existing-repayment.entity';
import { Repository, DataSource } from 'typeorm';
import { FinExistingGuarantee } from 'src/entities/fin-existing-guarantee.entity';
import { FinExistingGuaranteeAsset } from 'src/entities/fin-existing-guarantee-asset.entity';
import { FinExistingLinkage } from 'src/entities/fin-existing-linkage.entity';
import { FinExistingDisbursementRepaymentRel } from 'src/entities/fin-existing-disbursement-repayment-rel.entity';
import { CreateFinExistingDto } from './dto/create-fin-existing.dto';
import { UpdateFinExistingDto } from './dto/update-fin-existing.dto';
import { SearchFinExistingDto } from './dto/search-fin-existing.dto';
import { FinExistingListItemDto } from './dto/fin-existing-list.dto';
import { CreateFinExistingGuaranteeDto } from './dto/create-fin-existing-guarantee.dto';
import { UpdateFinExistingGuaranteeDto } from './dto/update-fin-existing-guarantee.dto';
import { FinExistingGuaranteeDto } from './dto/fin-existing-guarantee.dto';
import { SNOWFLAKE } from 'src/common/providers';
import { Snowflake } from 'src/common/utils/snowflake';
import { UserContext } from 'src/common/context/user-context';
import { RaxBizException } from 'src/common/exceptions/rax-biz.exception';
import { LoggerService } from 'src/common/logger/logger.service';
import { CodeUtil } from 'src/common/utils/code.util';
import { PageResult } from 'src/common/entities/page.entity';
import { FinExistingConverter } from './converters/fin-existing.converter';
import { FinExistingValidator } from './validators/fin-existing.validator';
import { GuaranteeHelper } from './helpers/guarantee.helper';
import { FinExistingFactory } from './factories/fin-existing.factory';

/**
 * 存量融资服务
 * 主要负责业务逻辑的编排和事务管理
 */
@Injectable()
export class FinExistingService {
  private readonly CONTEXT = 'FinExistingService';

  constructor(
    @InjectRepository(FinExisting)
    private readonly finExistingRepo: Repository<FinExisting>,
    @InjectRepository(FinExistingDisbursement)
    private readonly finExistingDisbursementRepo: Repository<FinExistingDisbursement>,
    @InjectRepository(FinExistingRepayment)
    private readonly finExistingRepaymentRepo: Repository<FinExistingRepayment>,
    @InjectRepository(FinExistingGuarantee)
    private readonly finExistingGuaranteeRepo: Repository<FinExistingGuarantee>,
    @InjectRepository(FinExistingGuaranteeAsset)
    private readonly finExistingGuaranteeAssetRepo: Repository<FinExistingGuaranteeAsset>,
    @InjectRepository(FinExistingLinkage)
    private readonly finExistingLinkageRepo: Repository<FinExistingLinkage>,
    @InjectRepository(FinExistingDisbursementRepaymentRel)
    private readonly finExistingDisbursementRepaymentRelRepo: Repository<FinExistingDisbursementRepaymentRel>,
    private readonly dataSource: DataSource,
    @Inject(SNOWFLAKE)
    private readonly snowflake: Snowflake,
    @Inject('UserContext')
    private readonly userContext: UserContext,
    private readonly logger: LoggerService,
    private readonly converter: FinExistingConverter,
    private readonly validator: FinExistingValidator,
    private readonly guaranteeHelper: GuaranteeHelper,
    private readonly factory: FinExistingFactory,
  ) {}

  /**
   * 创建存量融资记录
   * 包含基本信息、放款计划、还款计划、担保信息和关联信息
   * 
   * 金额处理规则：
   * 1. 接收参数中的金额为万元字符串，支持 6 位小数
   * 2. 存储时转换为分（整数）
   * 3. 字符串处理避免精度问题
   * 
   * @param createDto 创建存量融资的数据传输对象
   * @returns {Promise<string>} 创建的存量融资实体ID
   */
  async createFinExisting(createDto: CreateFinExistingDto): Promise<string> {
    this.logger.info(this.CONTEXT, `开始创建存量融资记录，融资主体: ${createDto.orgId}, 金融机构: ${createDto.financialInstitution}, 融资金额(万元): ${createDto.fundingAmount}`);

    // 创建新的存量融资实体
    const finExisting = this.factory.createFinExistingEntity(createDto);

    // 开启事务
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 保存基本信息
      const savedEntity = await queryRunner.manager.save(finExisting);

      await queryRunner.commitTransaction();
      
      this.logger.info(this.CONTEXT, {
        message: '存量融资记录创建成功',
        finExistingId: savedEntity.id,
        code: savedEntity.code,
        fundingAmountInWan: createDto.fundingAmount,
        fundingAmountInCent: savedEntity.fundingAmount,
        returnInterestRate: createDto.returnInterestRate,
        loanPrimeRate: createDto.loanPrimeRate,
        basisPoint: createDto.basisPoint
      });
      
      return savedEntity.id;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      this.logger.error(this.CONTEXT, err, '创建存量融资记录失败');
      throw new RaxBizException('创建存量融资记录失败');
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * 更新存量融资记录
   * 包含业务规则验证：
   * 1. 修改"是否为多次放款"时，如果已有多条放款记录，不允许修改为"否"
   * 2. 修改"融资总额"时，修改后的总额不能小于全部已放款金额的综合
   * 
   * 金额处理规则：
   * 1. 接收参数中的金额为万元字符串，支持 6 位小数
   * 2. 存储时转换为分（整数）
   * 3. 字符串处理避免精度问题
   * 
   * 更新规则：
   * 1. 仅更新 updateDto 中有值的字段
   * 2. undefined 或 null 的字段不会被更新
   * 
   * @param updateDto 更新存量融资的数据传输对象
   * @returns {Promise<boolean>} 更新是否成功
   * @throws {RaxBizException} 当记录不存在或违反业务规则时
   */
  async updateFinExisting(updateDto: UpdateFinExistingDto): Promise<boolean> {
    this.logger.info(this.CONTEXT, `开始更新存量融资记录，ID: ${updateDto.id}`);

    // 检查记录是否存在
    const existingRecord = await this.validator.checkFinExistingExists(updateDto.id);

    // 构建动态更新对象，只包含有值的字段
    const updateData = this.factory.createUpdateData(updateDto);

    // 业务规则验证（只在相关字段有更新时进行）
    if (updateDto.isMultiple !== undefined) {
      await this.validator.validateIsMultipleChange(updateDto.id, updateDto.isMultiple);
    }
    if (updateDto.fundingAmount !== undefined) {
      const newFundingAmountInCent = this.converter.convertWanToCent(updateDto.fundingAmount);
      await this.validator.validateFundingAmountChange(updateDto.id, newFundingAmountInCent);
    }

    // 开启事务
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 更新实体数据
      const updatedEntity = this.finExistingRepo.merge(existingRecord, updateData);

      // 保存更新
      await queryRunner.manager.save(updatedEntity);

      await queryRunner.commitTransaction();
      
      this.logger.info(this.CONTEXT, {
        message: '存量融资记录更新成功',
        finExistingId: updateDto.id,
        code: existingRecord.code,
        updatedFields: Object.keys(updateData).filter(key => key !== 'updateBy' && key !== 'updateTime'),
        fundingAmountInWan: updateDto.fundingAmount,
        fundingAmountInCent: updateData.fundingAmount,
        isMultiple: updateDto.isMultiple
      });
      
      return true;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      this.logger.error(this.CONTEXT, err, '更新存量融资记录失败');
      throw new RaxBizException('更新存量融资记录失败');
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * 删除存量融资记录（软删除）
   * 只将 is_deleted 标记为 true，不对关联数据进行操作
   * 
   * @param id 存量融资ID
   * @returns {Promise<boolean>} 删除是否成功
   * @throws {RaxBizException} 当记录不存在时
   */
  async removeFinExisting(id: string): Promise<boolean> {
    this.logger.info(this.CONTEXT, `开始删除存量融资记录，ID: ${id}`);

    // 检查记录是否存在
    const existingRecord = await this.validator.checkFinExistingExists(id);

    // 检查是否已经删除
    if (existingRecord.isDeleted) {
      throw new RaxBizException(`存量融资记录 ${id} 已经被删除`);
    }

    // 开启事务
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 软删除：只更新 isDeleted 标记
      const updateData = this.factory.createSoftDeleteData();
      const updatedEntity = this.finExistingRepo.merge(existingRecord, updateData);

      // 保存更新
      await queryRunner.manager.save(updatedEntity);

      await queryRunner.commitTransaction();
      
      this.logger.info(this.CONTEXT, {
        message: '存量融资记录删除成功',
        finExistingId: id,
        code: existingRecord.code,
        finName: existingRecord.finName
      });
      
      return true;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      this.logger.error(this.CONTEXT, err, '删除存量融资记录失败');
      throw new RaxBizException('删除存量融资记录失败');
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * 多条件分页搜索存量融资
   * 支持的搜索条件：
   * - 编码（等值匹配）
   * - 融资主体ID（等值匹配）
   * - 融资名称（模糊匹配）
   * - 融资结构（等值匹配）
   * - 融资方式（等值匹配）
   * - 金融机构（模糊匹配）
   * - 融资总额（范围匹配，万元输入）
   * - 是否为多次放款（等值匹配）
   * - 融资期限（范围匹配）
   * - 是否为公开融资（等值匹配）
   * - 还款周期（等值匹配）
   * - 还款方式（等值匹配）
   * - 利息类型（等值匹配）
   * 
   * @param searchDto 搜索条件DTO
   * @returns {Promise<PageResult<FinExistingListItemDto>>} 分页搜索结果
   */
  async searchFinExisting(searchDto: SearchFinExistingDto): Promise<PageResult<FinExistingListItemDto>> {
    // 确保分页参数有默认值
    const pageNo = searchDto.pageNo || 1;
    const pageSize = searchDto.pageSize || 10;

    this.logger.info(this.CONTEXT, `开始搜索存量融资，页码: ${pageNo}, 页大小: ${pageSize}`);

    const queryBuilder = this.finExistingRepo.createQueryBuilder('fe');

    // 排除已删除的记录
    queryBuilder.where('fe.isDeleted = :isDeleted', { isDeleted: false });

    // 编码（等值匹配）
    if (searchDto.code) {
      queryBuilder.andWhere('fe.code = :code', { code: searchDto.code });
    }

    // 融资主体ID（等值匹配）
    if (searchDto.orgId) {
      queryBuilder.andWhere('fe.orgId = :orgId', { orgId: searchDto.orgId });
    }

    // 融资名称（模糊匹配）
    if (searchDto.finName) {
      queryBuilder.andWhere('fe.finName LIKE :finName', { finName: `%${searchDto.finName}%` });
    }

    // 融资结构（等值匹配）
    if (searchDto.fundingStructure) {
      queryBuilder.andWhere('fe.fundingStructure = :fundingStructure', { fundingStructure: searchDto.fundingStructure });
    }

    // 融资方式（等值匹配）
    if (searchDto.fundingMode) {
      queryBuilder.andWhere('fe.fundingMode = :fundingMode', { fundingMode: searchDto.fundingMode });
    }

    // 金融机构（模糊匹配）
    if (searchDto.financialInstitution) {
      queryBuilder.andWhere('fe.financialInstitution LIKE :financialInstitution', { 
        financialInstitution: `%${searchDto.financialInstitution}%` 
      });
    }

    // 融资总额范围匹配（万元转为分）
    if (searchDto.fundingAmountMin !== undefined) {
      const minAmountInCent = this.converter.convertWanToCent(searchDto.fundingAmountMin);
      queryBuilder.andWhere('fe.fundingAmount >= :fundingAmountMin', { fundingAmountMin: minAmountInCent });
    }
    if (searchDto.fundingAmountMax !== undefined) {
      const maxAmountInCent = this.converter.convertWanToCent(searchDto.fundingAmountMax);
      queryBuilder.andWhere('fe.fundingAmount <= :fundingAmountMax', { fundingAmountMax: maxAmountInCent });
    }

    // 是否为多次放款（等值匹配）
    if (searchDto.isMultiple !== undefined) {
      queryBuilder.andWhere('fe.isMultiple = :isMultiple', { isMultiple: searchDto.isMultiple });
    }

    // 融资期限范围匹配
    if (searchDto.finTermMin !== undefined) {
      queryBuilder.andWhere('fe.finTerm >= :finTermMin', { finTermMin: searchDto.finTermMin });
    }
    if (searchDto.finTermMax !== undefined) {
      queryBuilder.andWhere('fe.finTerm <= :finTermMax', { finTermMax: searchDto.finTermMax });
    }

    // 是否为公开融资（等值匹配）
    if (searchDto.isPublic !== undefined) {
      queryBuilder.andWhere('fe.isPublic = :isPublic', { isPublic: searchDto.isPublic });
    }

    // 还款周期（等值匹配）
    if (searchDto.repaymentPeriod !== undefined) {
      queryBuilder.andWhere('fe.repaymentPeriod = :repaymentPeriod', { repaymentPeriod: searchDto.repaymentPeriod });
    }

    // 还款方式（等值匹配）
    if (searchDto.repaymentMethod !== undefined) {
      queryBuilder.andWhere('fe.repaymentMethod = :repaymentMethod', { repaymentMethod: searchDto.repaymentMethod });
    }

    // 利息类型（等值匹配）
    if (searchDto.interestType !== undefined) {
      queryBuilder.andWhere('fe.interestType = :interestType', { interestType: searchDto.interestType });
    }

    // 排序：按创建时间降序
    queryBuilder.orderBy('fe.createTime', 'DESC');

    // 分页
    const skip = (pageNo - 1) * pageSize;
    queryBuilder.skip(skip).take(pageSize);

    // 执行查询
    const [entities, total] = await queryBuilder.getManyAndCount();

    // 转换为DTO
    const rows = entities.map(entity => this.converter.convertToListItemDto(entity));

    this.logger.info(this.CONTEXT, {
      message: '存量融资搜索完成',
      total,
      pageNo,
      pageSize,
      resultCount: rows.length
    });

    // 返回分页结果
    return PageResult.of(pageNo, pageSize, total, rows);
  }

  /**
   * 根据ID获取存量融资基本信息
   * 
   * @param id 存量融资ID
   * @returns {Promise<FinExistingListItemDto>} 存量融资详情
   * @throws {RaxBizException} 当记录不存在或已删除时
   */
  async getFinExistingById(id: string): Promise<FinExistingListItemDto> {
    this.logger.info(this.CONTEXT, `开始查询存量融资详情，ID: ${id}`);

    // 查询存量融资记录
    const finExisting = await this.finExistingRepo.findOne({
      where: { 
        id,
        isDeleted: false // 排除已删除的记录
      }
    });

    if (!finExisting) {
      this.logger.warn(this.CONTEXT, `存量融资记录不存在或已删除，ID: ${id}`);
      throw new RaxBizException(`存量融资记录 ${id} 不存在或已删除`);
    }

    // 转换为DTO
    const detailDto = this.converter.convertToListItemDto(finExisting);

    this.logger.info(this.CONTEXT, {
      message: '存量融资详情查询成功',
      finExistingId: id,
      code: finExisting.code,
      finName: finExisting.finName,
      fundingAmountInCent: finExisting.fundingAmount
    });

    return detailDto;
  }

  // ==================== 融资担保相关接口 ====================

  /**
   * 创建融资担保记录
   * 包含担保基本信息、反担保记录和担保物关系
   * 
   * 金额处理规则：
   * 1. 接收参数中的金额为万元字符串，支持 6 位小数
   * 2. 存储时转换为分（整数）
   * 3. 字符串处理避免精度问题
   * 
   * @param createDto 创建融资担保的数据传输对象
   * @returns {Promise<FinExistingGuaranteeDto>} 创建的融资担保详情
   */
  async createGuarantee(createDto: CreateFinExistingGuaranteeDto): Promise<FinExistingGuaranteeDto> {
    this.logger.info(this.CONTEXT, `开始创建融资担保记录，存量融资ID: ${createDto.existingId}, 担保类型: ${createDto.guaranteeType}, 反担保数量: ${createDto.counterGuarantees?.length || 0}`);

    // 检查存量融资记录是否存在
    await this.validator.checkFinExistingExists(createDto.existingId);

    // 创建新的融资担保实体
    const guarantee = this.factory.createGuaranteeEntity(createDto);

    // 开启事务
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 保存主担保记录
      const savedGuarantee = await queryRunner.manager.save(guarantee);

      // 保存主担保的担保物关系
      if (createDto.assetIds && createDto.assetIds.length > 0) {
        await this.guaranteeHelper.saveGuaranteeAssets(savedGuarantee.id, createDto.assetIds, queryRunner);
      }

      // 创建反担保记录
      if (createDto.counterGuarantees && createDto.counterGuarantees.length > 0) {
        for (const counterGuaranteeDto of createDto.counterGuarantees) {
          await this.guaranteeHelper.saveCounterGuarantee(savedGuarantee.id, createDto.existingId, counterGuaranteeDto, queryRunner);
        }
      }

      await queryRunner.commitTransaction();
      
      this.logger.info(this.CONTEXT, {
        message: '融资担保记录创建成功',
        guaranteeId: savedGuarantee.id,
        existingId: createDto.existingId,
        guaranteeType: createDto.guaranteeType,
        guaranteeBonusInWan: createDto.guaranteeBonus,
        guaranteeBonusInCent: savedGuarantee.guaranteeBonus,
        assetCount: createDto.assetIds?.length || 0,
        counterGuaranteeCount: createDto.counterGuarantees?.length || 0
      });
      
      // 返回完整的担保详情
      return await this.guaranteeHelper.convertToGuaranteeDto(savedGuarantee);
    } catch (err) {
      await queryRunner.rollbackTransaction();
      this.logger.error(this.CONTEXT, err, '创建融资担保记录失败');
      throw new RaxBizException('创建融资担保记录失败');
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * 更新融资担保记录
   * 支持部分字段更新，包含担保基本信息、反担保记录和担保物关系
   * 
   * 金额处理规则：
   * 1. 接收参数中的金额为万元字符串，支持 6 位小数
   * 2. 存储时转换为分（整数）
   * 3. 字符串处理避免精度问题
   * 
   * @param updateDto 更新融资担保的数据传输对象
   * @returns {Promise<FinExistingGuaranteeDto>} 更新后的融资担保详情
   */
  async updateGuarantee(updateDto: UpdateFinExistingGuaranteeDto): Promise<FinExistingGuaranteeDto> {
    this.logger.info(this.CONTEXT, `开始更新融资担保记录，ID: ${updateDto.id}, 反担保数量: ${updateDto.counterGuarantees?.length || 0}`);

    // 检查担保记录是否存在
    const existingGuarantee = await this.validator.checkGuaranteeExists(updateDto.id);

    // 构建动态更新对象，只包含有值的字段
    const updateData = this.factory.createGuaranteeUpdateData(updateDto);

    // 开启事务
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 更新主担保记录
      const updatedGuarantee = this.finExistingGuaranteeRepo.merge(existingGuarantee, updateData);
      const savedGuarantee = await queryRunner.manager.save(updatedGuarantee);

      // 更新主担保的担保物关系
      if (updateDto.assetIds !== undefined) {
        // 先删除现有关系
        await this.guaranteeHelper.removeGuaranteeAssets(updateDto.id, queryRunner);
        // 再保存新关系
        if (updateDto.assetIds.length > 0) {
          await this.guaranteeHelper.saveGuaranteeAssets(updateDto.id, updateDto.assetIds, queryRunner);
        }
      }

      // 更新反担保记录
      if (updateDto.counterGuarantees !== undefined) {
        // 删除所有现有的反担保记录
        const existingCounterGuarantees = await this.guaranteeHelper.getCounterGuarantees(updateDto.id);
        for (const counterGuarantee of existingCounterGuarantees) {
          // 删除反担保的担保物关系
          await this.guaranteeHelper.removeGuaranteeAssets(counterGuarantee.id, queryRunner);
          // 删除反担保记录
          await queryRunner.manager.delete(FinExistingGuarantee, { id: counterGuarantee.id });
        }

        // 创建或更新新的反担保记录
        for (const counterGuaranteeDto of updateDto.counterGuarantees) {
          await this.guaranteeHelper.saveCounterGuarantee(updateDto.id, existingGuarantee.existingId, counterGuaranteeDto, queryRunner);
        }
      }

      await queryRunner.commitTransaction();
      
      this.logger.info(this.CONTEXT, {
        message: '融资担保记录更新成功',
        guaranteeId: updateDto.id,
        updatedFields: Object.keys(updateData).filter(key => key !== 'updateBy' && key !== 'updateTime'),
        guaranteeBonusInWan: updateDto.guaranteeBonus,
        assetCount: updateDto.assetIds?.length,
        counterGuaranteeCount: updateDto.counterGuarantees?.length
      });
      
      // 返回完整的担保详情
      return await this.guaranteeHelper.convertToGuaranteeDto(savedGuarantee);
    } catch (err) {
      await queryRunner.rollbackTransaction();
      this.logger.error(this.CONTEXT, err, '更新融资担保记录失败');
      throw new RaxBizException('更新融资担保记录失败');
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * 删除融资担保记录
   * 删除担保记录时，会同时删除反担保记录和担保物记录
   * 
   * @param params 包含担保ID的参数对象
   * @returns {Promise<boolean>} 删除是否成功
   */
  async removeGuarantee(params: { id: string }): Promise<boolean> {
    this.logger.info(this.CONTEXT, `开始删除融资担保记录，ID: ${params.id}`);

    // 检查担保记录是否存在
    const guarantee = await this.validator.checkGuaranteeExists(params.id);

    // 开启事务
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. 删除反担保记录
      const counterGuarantees = await this.guaranteeHelper.getCounterGuarantees(params.id);
      for (const counterGuarantee of counterGuarantees) {
        // 删除反担保的担保物关系
        await this.guaranteeHelper.removeGuaranteeAssets(counterGuarantee.id, queryRunner);
        // 删除反担保记录
        await queryRunner.manager.delete(FinExistingGuarantee, { id: counterGuarantee.id });
      }

      // 2. 删除担保物关系
      await this.guaranteeHelper.removeGuaranteeAssets(params.id, queryRunner);

      // 3. 删除担保记录
      await queryRunner.manager.delete(FinExistingGuarantee, { id: params.id });

      await queryRunner.commitTransaction();
      
      this.logger.info(this.CONTEXT, {
        message: '融资担保记录删除成功',
        guaranteeId: params.id,
        existingId: guarantee.existingId,
        counterGuaranteeCount: counterGuarantees.length
      });
      
      return true;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      this.logger.error(this.CONTEXT, err, '删除融资担保记录失败');
      throw new RaxBizException('删除融资担保记录失败');
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * 根据融资担保记录ID查询融资担保详情
   * 查询融资担保记录时，要同时查询反担保记录和担保物记录
   * 
   * @param id 融资担保ID
   * @returns {Promise<FinExistingGuaranteeDto>} 融资担保详情
   */
  async getGuaranteeById(id: string): Promise<FinExistingGuaranteeDto> {
    this.logger.info(this.CONTEXT, `开始查询融资担保详情，ID: ${id}`);

    // 检查担保记录是否存在
    const guarantee = await this.validator.checkGuaranteeExists(id);

    // 转换为详情DTO（包含关联数据）
    const guaranteeDto = await this.guaranteeHelper.convertToGuaranteeDto(guarantee, true);

    this.logger.info(this.CONTEXT, {
      message: '融资担保详情查询成功',
      guaranteeId: id,
      existingId: guarantee.existingId,
      guaranteeType: guarantee.guaranteeType,
      counterGuaranteeCount: guaranteeDto.counterGuarantees?.length || 0,
      assetCount: guaranteeDto.assetIds?.length || 0
    });

    return guaranteeDto;
  }

  /**
   * 根据存量融资ID查询所有的融资担保记录
   * 查询融资担保记录时，要同时查询反担保记录和担保物记录
   * 
   * @param existingId 存量融资ID
   * @returns {Promise<FinExistingGuaranteeDto[]>} 融资担保记录数组
   */
  async getGuaranteesByExistingId(existingId: string): Promise<FinExistingGuaranteeDto[]> {
    this.logger.info(this.CONTEXT, `开始查询存量融资的所有担保记录，存量融资ID: ${existingId}`);

    // 检查存量融资记录是否存在
    await this.validator.checkFinExistingExists(existingId);

    // 查询所有担保记录（只查询主担保，不包括反担保）
    const guarantees = await this.finExistingGuaranteeRepo.find({
      where: { 
        existingId,
        counterGuaranteeId: '0' // 只查询主担保记录
      },
      order: { createTime: 'DESC' }
    });

    // 转换为详情DTO数组（包含关联数据）
    const guaranteeDtos = await Promise.all(
      guarantees.map(guarantee => this.guaranteeHelper.convertToGuaranteeDto(guarantee, true))
    );

    this.logger.info(this.CONTEXT, {
      message: '存量融资担保记录查询成功',
      existingId,
      guaranteeCount: guarantees.length,
      totalCounterGuarantees: guaranteeDtos.reduce((sum, dto) => sum + (dto.counterGuarantees?.length || 0), 0),
      totalAssets: guaranteeDtos.reduce((sum, dto) => sum + (dto.assetIds?.length || 0), 0)
    });

    return guaranteeDtos;
  }
} 