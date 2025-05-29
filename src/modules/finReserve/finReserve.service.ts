import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository, Like } from 'typeorm';
import { FinReserve, FinReserveStatus } from '../../entities/finReserve.entity';
import { FinReserveCosts } from '../../entities/finReserveCosts.entity';
import { FinReserveProgress } from '../../entities/finReserveProgress.entity';
import { FinReserveProgressReport } from '../../entities/finReserveProgressReport.entity';
import { CreateReserveDto } from './dto/create-reserve.dto';
import { UpdateReserveDto } from './dto/update-reserve.dto';
import { UserContext } from '../../common/context/user-context';
import { Snowflake } from '../../common/utils/snowflake';
import { SNOWFLAKE } from 'src/common/providers';
import { RaxBizException } from '../../common/exceptions/rax-biz.exception';
import { ReserveDetailResponseDto, ReserveBaseInfoDto } from './dto/reserve-detail.dto';
import { ConfirmProgressDto } from './dto/confirm-progress.dto';
import { DateUtil } from '../../common/utils/date.util';
import { CreateProgressReportDto } from './dto/create-progress-report.dto';
import { SearchReserveDto } from './dto/search-reserve.dto';
import { ReserveListItemDto } from './dto/reserve-list.dto';
import { PageResult } from '../../common/entities/page.entity';
import { CodeUtil } from '../../common/utils/code.util';
import { LoggerService } from '../../common/logger/logger.service';
import { FinReserveConverter } from './converters/fin-reserve.converter';
import { FinReserveValidator } from './validators/fin-reserve.validator';
import { FinReserveFactory } from './factories/fin-reserve.factory';

/**
 * 融资储备服务
 * 主要负责业务逻辑的编排和事务管理
 */
@Injectable()
export class FinReserveService {
  private readonly CONTEXT = 'FinReserveService';

  constructor(
    @InjectRepository(FinReserve)
    private readonly finReserveRepository: Repository<FinReserve>,
    @InjectRepository(FinReserveCosts)
    private readonly finReserveCostsRepository: Repository<FinReserveCosts>,
    @InjectRepository(FinReserveProgress)
    private readonly finReserveProgressRepository: Repository<FinReserveProgress>,
    @InjectRepository(FinReserveProgressReport)
    private readonly finReserveProgressReportRepository: Repository<FinReserveProgressReport>,
    private readonly dataSource: DataSource,
    @Inject(SNOWFLAKE)
    private readonly snowflake: Snowflake,
    @Inject('UserContext')
    private readonly userContext: UserContext,
    private readonly logger: LoggerService,
    private readonly converter: FinReserveConverter,
    private readonly validator: FinReserveValidator,
    private readonly factory: FinReserveFactory,
  ) {}

  /**
   * 创建储备融资记录
   * 包含基本信息、成本构成和进度控制信息
   * 
   * 金额处理规则：
   * 1. 接收参数中的金额为万元，支持小数
   * 2. 存储时转换为分（整数）
   * 3. 避免浮点数精度问题
   * 
   * @param createReserveDto 创建储备融资的数据传输对象
   * @returns {Promise<FinReserve>} 创建的储备融资实体
   */
  async create(createReserveDto: CreateReserveDto): Promise<FinReserve> {
    this.logger.info(this.CONTEXT, `开始创建储备融资记录，融资主体: ${createReserveDto.orgId}, 金融机构: ${createReserveDto.financialInstitution}, 融资金额(万元): ${createReserveDto.fundingAmount}`);
    
    const reserveId = this.snowflake.nextId();

    // 准备所有实体对象
    const reserve = this.factory.createReserveEntity(createReserveDto, reserveId);
    const costs = this.factory.createCostEntities(createReserveDto.costDetails, reserveId);
    const progresses = this.factory.createProgressEntities(createReserveDto.progressList, reserveId);

    // 开启事务
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 批量写入所有数据
      await queryRunner.manager.save(reserve);
      await queryRunner.manager.save(costs);
      await queryRunner.manager.save(progresses);

      await queryRunner.commitTransaction();
      
      this.logger.info(this.CONTEXT, {
        message: '储备融资记录创建成功',
        reserveId: reserve.id,
        code: reserve.code,
        fundingAmountInWan: createReserveDto.fundingAmount,
        fundingAmountInCent: reserve.fundingAmount,
        costsCount: costs.length,
        progressCount: progresses.length
      });
      
      return reserve;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      this.logger.error(this.CONTEXT, err, '创建储备融资记录失败');
      throw new RaxBizException('创建储备融资记录失败');
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * 更新储备融资记录
   * 包含基本信息、成本构成和进度控制信息的更新
   * 
   * 业务规则：
   * 1. 只有待放款状态的储备融资可以被编辑
   * 2. 已填写实际日期的进度不允许修改
   * 
   * 金额处理规则：
   * 1. 接收参数中的金额为万元，支持小数
   * 2. 存储时转换为分（整数）
   * 3. 避免浮点数精度问题
   * 
   * @param updateReserveDto 更新储备融资的数据传输对象
   * @returns {Promise<boolean>} 更新成功返回true
   * @throws {RaxBizException} 当储备融资记录不存在或状态不允许更新时
   */
  async update(updateReserveDto: UpdateReserveDto): Promise<boolean> {
    this.logger.info(this.CONTEXT, `开始更新储备融资记录，ID: ${updateReserveDto.id}`);

    // 检查记录是否存在并验证状态
    const existingReserve = await this.validator.checkReserveExists(updateReserveDto.id);
    this.validator.validateEditableStatus(existingReserve);

    // 验证进度更新是否允许
    await this.validator.validateProgressUpdate(updateReserveDto.id, updateReserveDto.progressList);

    // 准备更新的实体
    const updatedReserve = this.factory.updateReserveEntity(updateReserveDto, existingReserve);
    const newCosts = this.factory.createCostEntities(updateReserveDto.costDetails, updateReserveDto.id);
    
    // 获取现有进度记录，智能更新进度数据
    const existingProgresses = await this.finReserveProgressRepository.find({
      where: { reserveId: updateReserveDto.id }
    });
    
    const updatedProgresses = await this.mergeProgressUpdates(
      existingProgresses, 
      updateReserveDto.progressList, 
      updateReserveDto.id
    );

    // 开启事务
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 执行所有写操作
      await queryRunner.manager.save(updatedReserve);
      
      // 成本明细：删除重建（成本明细通常没有状态需要保留）
      await queryRunner.manager.delete(FinReserveCosts, { reserveId: updateReserveDto.id });
      await queryRunner.manager.save(newCosts);
      
      // 进度数据：智能更新（保留已确认进度的状态）
      await queryRunner.manager.delete(FinReserveProgress, { reserveId: updateReserveDto.id });
      await queryRunner.manager.save(updatedProgresses);

      await queryRunner.commitTransaction();
      
      this.logger.info(this.CONTEXT, {
        message: '储备融资记录更新成功',
        reserveId: updatedReserve.id,
        fundingAmountInWan: updateReserveDto.fundingAmount,
        fundingAmountInCent: updatedReserve.fundingAmount,
        fundingAmountChange: updatedReserve.fundingAmount - existingReserve.fundingAmount,
        newCostsCount: newCosts.length,
        newProgressCount: updatedProgresses.length,
        preservedProgressCount: updatedProgresses.filter(p => p.actualDate).length
      });
      
      return true;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      this.logger.error(this.CONTEXT, err, '更新储备融资记录失败');
      throw new RaxBizException('更新储备融资记录失败');
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * 智能合并进度更新
   * 保留已确认进度的 actualDate、delayDays 等字段
   * 
   * 匹配策略：按进度名称匹配，避免排序问题
   * 
   * @param existingProgresses 现有进度记录
   * @param newProgressList 新的进度数据
   * @param reserveId 储备融资ID
   * @returns {Promise<FinReserveProgress[]>} 合并后的进度记录
   */
  private async mergeProgressUpdates(
    existingProgresses: FinReserveProgress[], 
    newProgressList: CreateReserveDto['progressList'], 
    reserveId: string
  ): Promise<FinReserveProgress[]> {
    const updatedProgresses: FinReserveProgress[] = [];
    
    // 建立现有进度的名称到记录的映射
    const existingProgressMap = new Map<string, FinReserveProgress>();
    existingProgresses.forEach(progress => {
      existingProgressMap.set(progress.progressName, progress);
    });
    
    // 遍历新的进度列表，按名称匹配现有记录
    for (const newProgress of newProgressList) {
      const existingProgress = existingProgressMap.get(newProgress.progressName);
      
      if (existingProgress && existingProgress.actualDate) {
        // 已确认的进度：保留原有的确认信息，只更新 planDate
        const mergedProgress = this.factory.createProgressEntities([newProgress], reserveId)[0];
        mergedProgress.id = existingProgress.id;
        mergedProgress.actualDate = existingProgress.actualDate;
        mergedProgress.delayDays = existingProgress.delayDays;
        // 更新字段
        mergedProgress.updateBy = this.userContext.getUsername()!;
        mergedProgress.updateTime = new Date();
        
        updatedProgresses.push(mergedProgress);
        
        this.logger.info(this.CONTEXT, {
          message: '保留已确认进度的状态',
          progressId: existingProgress.id,
          progressName: newProgress.progressName,
          oldPlanDate: existingProgress.planDate,
          newPlanDate: newProgress.planDate,
          actualDate: existingProgress.actualDate,
          delayDays: existingProgress.delayDays
        });
      } else if (existingProgress) {
        // 未确认的进度：正常更新
        const updatedProgress = this.factory.createProgressEntities([newProgress], reserveId)[0];
        updatedProgress.id = existingProgress.id;
        updatedProgress.updateBy = this.userContext.getUsername()!;
        updatedProgress.updateTime = new Date();
        
        updatedProgresses.push(updatedProgress);
        
        this.logger.info(this.CONTEXT, {
          message: '更新未确认进度',
          progressId: existingProgress.id,
          progressName: newProgress.progressName,
          oldPlanDate: existingProgress.planDate,
          newPlanDate: newProgress.planDate
        });
      } else {
        // 理论上不应该出现新增进度的情况，记录警告日志
        this.logger.warn(this.CONTEXT, {
          message: '发现新的进度名称，这可能是数据不一致',
          progressName: newProgress.progressName,
          reserveId
        });
        
        // 创建新的进度记录
        const newProgressEntity = this.factory.createProgressEntities([newProgress], reserveId)[0];
        updatedProgresses.push(newProgressEntity);
      }
    }
    
    // 检查是否有遗漏的现有进度（理论上不应该发生）
    const updatedProgressNames = new Set(newProgressList.map(p => p.progressName));
    const missingProgresses = existingProgresses.filter(p => !updatedProgressNames.has(p.progressName));
    
    if (missingProgresses.length > 0) {
      this.logger.warn(this.CONTEXT, {
        message: '发现在新进度列表中缺失的现有进度',
        missingProgressNames: missingProgresses.map(p => p.progressName),
        reserveId
      });
    }
    
    return updatedProgresses;
  }

  /**
   * 取消储备融资
   * 将储备融资状态更新为已取消，并记录取消原因
   * 
   * 业务规则:
   * 1. 只有待放款状态的储备融资可以被取消
   * 2. 取消后状态不可逆
   * 3. 必须提供取消原因，记录在进度报告中
   * 
   * @param id 储备融资ID
   * @param cancelReason 取消原因
   * @returns {Promise<boolean>} 取消成功返回true
   * @throws {RaxBizException} 当储备融资记录不存在或状态不允许取消时
   */
  async cancel(id: string, cancelReason: string): Promise<boolean> {
    this.logger.info(this.CONTEXT, `开始取消储备融资记录，ID: ${id}`);

    // 检查记录是否存在并验证状态
    const existingReserve = await this.validator.checkReserveExists(id);
    this.validator.validateCancellableStatus(existingReserve);

    // 准备更新的实体
    const updatedReserve = this.factory.updateReserveStatusToCancelled(existingReserve);
    const progressReport = this.factory.createCancelReportEntity(id, cancelReason);

    // 开启事务
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 在事务中执行更新
      await queryRunner.manager.save(FinReserve, updatedReserve);
      await queryRunner.manager.save(FinReserveProgressReport, progressReport);
      await queryRunner.commitTransaction();
      
      this.logger.info(this.CONTEXT, {
        message: '储备融资记录取消成功',
        reserveId: id,
        cancelReason,
        operator: this.userContext.getUsername()
      });
      
      return true;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      this.logger.error(this.CONTEXT, err, '取消储备融资失败');
      throw new RaxBizException('取消储备融资失败');
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * 删除储备融资记录
   * 同时删除关联的成本明细和进度记录
   * 
   * 业务规则:
   * 1. 只有待放款和已取消状态的储备融资可以被删除
   * 2. 删除操作不可逆
   * 3. 同时删除以下关联数据:
   *    - 储备融资基本信息(fin_reserve)
   *    - 成本明细(fin_reserve_costs)
   *    - 进度记录(fin_reserve_progress)
   *    - 进度报告(fin_reserve_progress_report)
   * 
   * @param id 储备融资ID
   * @returns {Promise<boolean>} 删除成功返回true
   * @throws {RaxBizException} 当储备融资记录不存在或状态不允许删除时
   */
  async delete(id: string): Promise<boolean> {
    this.logger.info(this.CONTEXT, `开始删除储备融资记录，ID: ${id}`);

    // 检查记录是否存在并验证状态
    const existingReserve = await this.validator.checkReserveExists(id);
    this.validator.validateDeletableStatus(existingReserve);

    // 开启事务
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 删除进度报告
      await queryRunner.manager.delete(FinReserveProgressReport, { reserveId: id });

      // 删除进度记录
      await queryRunner.manager.delete(FinReserveProgress, { reserveId: id });

      // 删除成本明细
      await queryRunner.manager.delete(FinReserveCosts, { reserveId: id });

      // 删除储备融资基本信息
      await queryRunner.manager.delete(FinReserve, { id });

      await queryRunner.commitTransaction();
      
      this.logger.info(this.CONTEXT, {
        message: '储备融资记录删除成功',
        reserveId: id,
        status: existingReserve.status,
        operator: this.userContext.getUsername()
      });
      
      return true;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      this.logger.error(this.CONTEXT, err, '删除储备融资失败');
      throw new RaxBizException('删除储备融资失败');
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * 查询储备融资详情
   * 包含基本信息、成本构成、进度控制和进度报告
   * 金额相关字段会从分转换为万元
   * 
   * @param id 储备融资ID
   * @returns {Promise<ReserveDetailResponseDto>} 储备融资详情
   * @throws {RaxBizException} 当储备融资记录不存在时
   */
  async findDetail(id: string): Promise<ReserveDetailResponseDto> {
    this.logger.info(this.CONTEXT, `开始查询储备融资详情，ID: ${id}`);

    // 查询基本信息
    const reserve = await this.validator.checkReserveExists(id);

    // 查询成本构成
    const costs = await this.finReserveCostsRepository.find({
      where: { reserveId: id }
    });

    // 查询进度控制
    const progresses = await this.finReserveProgressRepository.find({
      where: { reserveId: id }
    });

    // 查询进度报告
    const progressReports = await this.finReserveProgressReportRepository.find({
      where: { reserveId: id }
    });

    // 转换基本信息并组装响应数据
    const result = {
      reserve: this.converter.convertToBaseInfoDto(reserve),
      costs,
      progresses,
      progressReports
    };

    this.logger.info(this.CONTEXT, {
      message: '储备融资详情查询成功',
      reserveId: id,
      code: reserve.code,
      costsCount: costs.length,
      progressCount: progresses.length,
      progressReportCount: progressReports.length
    });

    return result;
  }

  /**
   * 确认进度完成
   * 记录实际完成日期并计算延期天数
   * 
   * 业务规则:
   * 1. 已完成的进度不允许重复确认
   * 2. 延期天数计算规则：
   *    - 提前完成：负数表示
   *    - 按时完成：0
   *    - 延期完成：正数表示
   * 
   * @param confirmProgressDto 确认进度的参数
   * @returns {Promise<boolean>} 确认成功返回true
   * @throws {RaxBizException} 当进度记录不存在或已完成时
   */
  async confirmProgress(confirmProgressDto: ConfirmProgressDto): Promise<boolean> {
    this.logger.info(this.CONTEXT, `开始确认进度完成，进度ID: ${confirmProgressDto.id}`);

    // 检查进度记录是否存在并验证
    const progress = await this.validator.checkProgressExists(confirmProgressDto.id);
    this.validator.validateProgressConfirmation(progress, confirmProgressDto.actualDate);

    // 更新进度记录
    const updatedProgress = this.factory.updateProgressWithActualDate(progress, confirmProgressDto.actualDate);

    // 开启事务
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 在事务中执行更新
      await queryRunner.manager.save(FinReserveProgress, updatedProgress);
      await queryRunner.commitTransaction();
      
      this.logger.info(this.CONTEXT, {
        message: '进度确认完成',
        progressId: progress.id,
        reserveId: progress.reserveId,
        progressName: progress.progressName,
        planDate: progress.planDate,
        actualDate: updatedProgress.actualDate,
        delayDays: updatedProgress.delayDays
      });
      
      return true;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      this.logger.error(this.CONTEXT, err, '确认进度完成失败');
      throw new RaxBizException('确认进度完成失败');
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * 查询储备融资的进度列表
   * 按照进度 ID 升序排列
   * 
   * @param reserveId 储备融资ID
   * @returns {Promise<FinReserveProgress[]>} 进度列表
   * @throws {RaxBizException} 当储备融资记录不存在时
   */
  async findProgressList(reserveId: string): Promise<FinReserveProgress[]> {
    this.logger.info(this.CONTEXT, `开始查询储备融资进度列表，储备融资ID: ${reserveId}`);

    // 先检查储备融资记录是否存在
    await this.validator.checkReserveExists(reserveId);

    // 查询进度列表并按 ID 升序排列
    const progressList = await this.finReserveProgressRepository.find({
      where: { reserveId },
      order: { id: 'ASC' }
    });

    this.logger.info(this.CONTEXT, {
      message: '储备融资进度列表查询成功',
      reserveId,
      progressCount: progressList.length
    });

    return progressList;
  }

  /**
   * 提交进度报告
   * 记录储备融资进展情况
   * 
   * @param createProgressReportDto 进度报告数据
   * @returns {Promise<boolean>} 创建成功返回true
   * @throws {RaxBizException} 当储备融资记录不存在时
   */
  async createProgressReport(createProgressReportDto: CreateProgressReportDto): Promise<boolean> {
    this.logger.info(this.CONTEXT, `开始提交进度报告，储备融资ID: ${createProgressReportDto.reserveId}`);

    // 先检查储备融资记录是否存在
    await this.validator.checkReserveExists(createProgressReportDto.reserveId);

    // 创建进度报告实体
    const progressReport = this.factory.createProgressReportEntity(createProgressReportDto);

    // 开启事务
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 在事务中保存进度报告
      await queryRunner.manager.save(FinReserveProgressReport, progressReport);
      await queryRunner.commitTransaction();
      
      this.logger.info(this.CONTEXT, {
        message: '进度报告提交成功',
        reportId: progressReport.id,
        reserveId: progressReport.reserveId,
        operator: progressReport.createBy
      });
      
      return true;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      this.logger.error(this.CONTEXT, err, '提交进度报告失败');
      throw new RaxBizException('提交进度报告失败');
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * 查询储备融资的进度报告列表
   * 按照创建时间倒序排列
   * 
   * @param reserveId 储备融资ID
   * @returns {Promise<FinReserveProgressReport[]>} 进度报告列表
   * @throws {RaxBizException} 当储备融资记录不存在时
   */
  async findProgressReports(reserveId: string): Promise<FinReserveProgressReport[]> {
    this.logger.info(this.CONTEXT, `开始查询储备融资进度报告列表，储备融资ID: ${reserveId}`);

    // 先检查储备融资记录是否存在
    await this.validator.checkReserveExists(reserveId);

    // 查询进度报告列表并按创建时间倒序排列
    const progressReports = await this.finReserveProgressReportRepository.find({
      where: { reserveId },
      order: { createTime: 'DESC' }
    });

    this.logger.info(this.CONTEXT, {
      message: '储备融资进度报告列表查询成功',
      reserveId,
      progressReportCount: progressReports.length
    });

    return progressReports;
  }

  /**
   * 多条件分页搜索储备融资
   * 
   * 搜索条件：
   * - 融资主体（等值匹配）
   * - 金融机构（全模糊）
   * - 融资方式（等值匹配）
   * - 状态（等值匹配）
   * - 负责人（等值匹配）
   * - 执行人（等值匹配）
   * 
   * @param searchDto 搜索条件
   * @returns {Promise<PageResult<ReserveListItemDto>>} 分页搜索结果
   */
  async search(searchDto: SearchReserveDto): Promise<PageResult<ReserveListItemDto>> {
    this.logger.info(this.CONTEXT, `开始搜索储备融资，页码: ${searchDto.pageNo}, 页大小: ${searchDto.pageSize}`);

    // 构建查询条件
    const where: any = {};
    
    if (searchDto.orgId) {
      where.orgId = searchDto.orgId;
    }
    
    if (searchDto.financialInstitution) {
      where.financialInstitution = Like(`%${searchDto.financialInstitution}%`);
    }
    
    if (searchDto.fundingMode) {
      where.fundingMode = searchDto.fundingMode;
    }
    
    if (searchDto.status) {
      where.status = searchDto.status;
    }
    
    if (searchDto.leaderId) {
      where.leaderId = searchDto.leaderId;
    }
    
    if (searchDto.executorId) {
      where.executorId = searchDto.executorId;
    }

    // 执行分页查询
    const [reserves, total] = await this.finReserveRepository.findAndCount({
      where,
      skip: (searchDto.pageNo - 1) * searchDto.pageSize,
      take: searchDto.pageSize,
      order: {
        createTime: 'DESC' // 默认按创建时间倒序
      }
    });

    // 转换为 DTO
    const rows = reserves.map(reserve => this.converter.convertToListItemDto(reserve));

    this.logger.info(this.CONTEXT, {
      message: '储备融资搜索完成',
      total,
      pageNo: searchDto.pageNo,
      pageSize: searchDto.pageSize,
      resultCount: rows.length
    });

    // 使用 PageResult 封装结果
    return PageResult.of(searchDto.pageNo, searchDto.pageSize, total, rows);
  }
} 