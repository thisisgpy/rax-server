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

/**
 * 融资储备服务
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
  ) {}

  /**
   * 检查储备融资记录是否存在
   * @param id 储备融资ID
   * @returns {Promise<FinReserve>} 储备融资实体
   * @throws {RaxBizException} 当储备融资记录不存在时
   */
  private async checkReserveExists(id: string): Promise<FinReserve> {
    const reserve = await this.finReserveRepository.findOne({
      where: { id }
    });

    if (!reserve) {
      throw new RaxBizException(`储备融资记录 ${id} 不存在`);
    }

    return reserve;
  }

  /**
    * 创建储备融资基本信息实体
    * @param createReserveDto 创建储备融资的数据传输对象
    * @param reserveId 储备融资ID
    * @returns 储备融资实体
    */
  private createReserveEntity(createReserveDto: CreateReserveDto, reserveId: string): FinReserve {
    const reserve = new FinReserve();
    reserve.id = reserveId;
    reserve.code = CodeUtil.generateReserveCode();
    reserve.orgId = createReserveDto.orgId;
    reserve.financialInstitution = createReserveDto.financialInstitution;
    reserve.fundingMode = createReserveDto.fundingMode;
    // 将万元转换为分
    reserve.fundingAmount = Math.round(createReserveDto.fundingAmount * 1000000);
    reserve.expectedDisbursementDate = createReserveDto.expectedDisbursementDate;
    reserve.loanRenewalFromId = createReserveDto.loanRenewalFromId;
    reserve.leaderName = createReserveDto.leaderName;
    reserve.leaderId = createReserveDto.leaderId;
    reserve.executorName = createReserveDto.executorName;
    reserve.executorId = createReserveDto.executorId;
    reserve.combinedRatio = createReserveDto.combinedRatio;
    // 将万元转换为分
    reserve.additionalCosts = Math.round(createReserveDto.additionalCosts * 1000000);
    reserve.status = FinReserveStatus.PENDING; // 待放款状态
    reserve.createBy = this.userContext.getUsername()!;
    reserve.createTime = new Date();
    return reserve;
  }

  /**
    * 更新储备融资基本信息实体
    * @param updateReserveDto 更新储备融资的数据传输对象
    * @param existingReserve 现有的储备融资实体
    * @returns 更新后的储备融资实体
    */
  private updateReserveEntity(updateReserveDto: UpdateReserveDto, existingReserve: FinReserve): FinReserve {
    existingReserve.orgId = updateReserveDto.orgId;
    existingReserve.financialInstitution = updateReserveDto.financialInstitution;
    existingReserve.fundingMode = updateReserveDto.fundingMode;
    existingReserve.fundingAmount = Math.round(updateReserveDto.fundingAmount * 1000000);
    existingReserve.expectedDisbursementDate = updateReserveDto.expectedDisbursementDate;
    existingReserve.loanRenewalFromId = updateReserveDto.loanRenewalFromId;
    existingReserve.leaderName = updateReserveDto.leaderName;
    existingReserve.leaderId = updateReserveDto.leaderId;
    existingReserve.executorName = updateReserveDto.executorName;
    existingReserve.executorId = updateReserveDto.executorId;
    existingReserve.combinedRatio = updateReserveDto.combinedRatio;
    existingReserve.additionalCosts = Math.round(updateReserveDto.additionalCosts * 1000000);
    existingReserve.updateBy = this.userContext.getUsername()!;
    existingReserve.updateTime = new Date();
    return existingReserve;
  }

  /**
    * 创建储备融资成本明细实体列表
    * @param costDetails 成本明细数据列表
    * @param reserveId 储备融资ID
    * @returns 成本明细实体列表
    */
  private createCostEntities(costDetails: CreateReserveDto['costDetails'], reserveId: string): FinReserveCosts[] {
    return costDetails.map(costDetail => {
      const cost = new FinReserveCosts();
      cost.id = this.snowflake.nextId();
      cost.reserveId = reserveId;
      cost.costType = costDetail.costType;
      cost.costAmount = costDetail.costAmount;
      cost.createBy = this.userContext.getUsername()!;
      cost.createTime = new Date();
      return cost;
    });
  }

  /**
    * 创建储备融资进度控制实体列表
    * @param progressList 进度控制数据列表
    * @param reserveId 储备融资ID
    * @returns 进度控制实体列表
    */
  private createProgressEntities(progressList: CreateReserveDto['progressList'], reserveId: string): FinReserveProgress[] {
    return progressList.map(progress => {
      const progressEntity = new FinReserveProgress();
      progressEntity.id = this.snowflake.nextId();
      progressEntity.reserveId = reserveId;
      progressEntity.progressName = progress.progressName;
      progressEntity.planDate = progress.planDate;
      progressEntity.updateBy = this.userContext.getUsername()!;
      return progressEntity;
    });
  }

  /**
   * 创建储备融资记录
   * 包含基本信息、成本构成和进度控制信息
   * @param createReserveDto 创建储备融资的数据传输对象
   * @returns 创建的储备融资实体
   */
  async create(createReserveDto: CreateReserveDto): Promise<FinReserve> {
    this.logger.info(this.CONTEXT, `开始创建储备融资记录，融资主体: ${createReserveDto.orgId}, 金融机构: ${createReserveDto.financialInstitution}`);
    
    const reserveId = this.snowflake.nextId();

    // 准备所有实体对象
    const reserve = this.createReserveEntity(createReserveDto, reserveId);
    const costs = this.createCostEntities(createReserveDto.costDetails, reserveId);
    const progresses = this.createProgressEntities(createReserveDto.progressList, reserveId);

    // 开启事务，仅包含数据库写入操作
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
        fundingAmount: reserve.fundingAmount,
        costsCount: costs.length,
        progressCount: progresses.length
      });
      
      return reserve;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      this.logger.error(this.CONTEXT, err, '创建储备融资记录失败');
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * 更新储备融资记录
   * 包含基本信息、成本构成和进度控制信息的更新
   * 
   * 更新流程:
   * 1. 数据校验
   *    - 检查储备融资记录是否存在
   *    - 验证记录状态是否为待放款(PENDING)
   *    - 获取并验证现有进度记录
   *    - 检查是否存在已填写实际日期的进度(不允许修改)
   * 
   * 2. 数据准备
   *    - 更新基本信息实体(金额从万元转换为分)
   *    - 准备新的成本明细实体列表
   *    - 准备新的进度控制实体列表
   * 
   * 3. 事务处理
   *    - 更新基本信息表(fin_reserve)
   *    - 删除并重建成本明细(fin_reserve_costs)
   *    - 删除并重建进度控制记录(fin_reserve_progress)
   * 
   * @param updateReserveDto 更新储备融资的数据传输对象
   * @returns {Promise<boolean>} 更新成功返回true
   * @throws {RaxBizException} 当储备融资记录不存在或状态不允许更新时
   */
  async update(updateReserveDto: UpdateReserveDto): Promise<boolean> {
    this.logger.info(this.CONTEXT, `开始更新储备融资记录，ID: ${updateReserveDto.id}`);

    // 先检查记录是否存在，并加载关联的进度信息
    const existingReserve = await this.checkReserveExists(updateReserveDto.id);
    
    // 检查状态是否为待放款
    if (existingReserve.status !== FinReserveStatus.PENDING) {
      const errMsg = '只有待放款状态的储备融资可以被编辑';
      this.logger.warn(this.CONTEXT, `更新储备融资失败: ${errMsg}, 当前状态: ${existingReserve.status}`);
      throw new RaxBizException(errMsg);
    }

    // 获取现有的进度记录
    const existingProgresses = await this.finReserveProgressRepository.find({
      where: { reserveId: updateReserveDto.id }
    });

    // 检查是否试图修改已有实际日期的进度
    const progressMap = new Map(existingProgresses.map(p => [p.progressName, p]));
    for (const newProgress of updateReserveDto.progressList) {
      const existingProgress = progressMap.get(newProgress.progressName);
      if (existingProgress?.actualDate) {
        const errMsg = `进度"${newProgress.progressName}"已填写实际日期，不允许编辑`;
        this.logger.warn(this.CONTEXT, `更新储备融资失败: ${errMsg}`);
        throw new RaxBizException(errMsg);
      }
    }

    // 准备更新的实体
    const updatedReserve = this.updateReserveEntity(updateReserveDto, existingReserve);
    const newCosts = this.createCostEntities(updateReserveDto.costDetails, updateReserveDto.id);
    const newProgresses = this.createProgressEntities(updateReserveDto.progressList, updateReserveDto.id);

    // 开启事务仅用于写操作
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 执行所有写操作
      await queryRunner.manager.save(updatedReserve);
      await queryRunner.manager.delete(FinReserveCosts, { reserveId: updateReserveDto.id });
      await queryRunner.manager.save(newCosts);
      await queryRunner.manager.delete(FinReserveProgress, { reserveId: updateReserveDto.id });
      await queryRunner.manager.save(newProgresses);

      await queryRunner.commitTransaction();
      
      this.logger.info(this.CONTEXT, {
        message: '储备融资记录更新成功',
        reserveId: updatedReserve.id,
        fundingAmountChange: updatedReserve.fundingAmount - existingReserve.fundingAmount,
        newCostsCount: newCosts.length,
        newProgressCount: newProgresses.length
      });
      
      return true;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      this.logger.error(this.CONTEXT, err, '更新储备融资记录失败');
      throw err;
    } finally {
      await queryRunner.release();
    }
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

    // 查询现有记录
    const existingReserve = await this.checkReserveExists(id);

    // 检查状态是否为待放款
    if (existingReserve.status !== FinReserveStatus.PENDING) {
      const errMsg = '只有待放款状态的储备融资可以被取消';
      this.logger.warn(this.CONTEXT, `取消储备融资失败: ${errMsg}, 当前状态: ${existingReserve.status}`);
      throw new RaxBizException(errMsg);
    }

    // 更新状态为已取消
    existingReserve.status = FinReserveStatus.CANCELLED;
    existingReserve.updateBy = this.userContext.getUsername()!;
    existingReserve.updateTime = new Date();

    // 创建进度报告记录取消原因
    const progressReport = new FinReserveProgressReport();
    progressReport.id = this.snowflake.nextId();
    progressReport.reserveId = id;
    progressReport.reportContent = `取消原因：${cancelReason}`;
    progressReport.createBy = this.userContext.getUsername()!;
    progressReport.createById = this.userContext.getUserId()!;
    progressReport.createTime = new Date();

    // 开启事务
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 在事务中执行更新
      await queryRunner.manager.save(FinReserve, existingReserve);
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
      // 发生错误时回滚事务
      await queryRunner.rollbackTransaction();
      this.logger.error(this.CONTEXT, err, '取消储备融资失败');
      throw new RaxBizException('取消储备融资失败');
    } finally {
      // 释放查询运行器
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

    // 查询现有记录
    const existingReserve = await this.checkReserveExists(id);

    // 检查状态是否允许删除
    if (![FinReserveStatus.PENDING, FinReserveStatus.CANCELLED].includes(existingReserve.status)) {
      const errMsg = '只有待放款和已取消状态的储备融资可以被删除';
      this.logger.warn(this.CONTEXT, `删除储备融资失败: ${errMsg}, 当前状态: ${existingReserve.status}`);
      throw new RaxBizException(errMsg);
    }

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

      // 提交事务
      await queryRunner.commitTransaction();
      
      this.logger.info(this.CONTEXT, {
        message: '储备融资记录删除成功',
        reserveId: id,
        status: existingReserve.status,
        operator: this.userContext.getUsername()
      });
      
      return true;
    } catch (err) {
      // 发生错误时回滚事务
      await queryRunner.rollbackTransaction();
      this.logger.error(this.CONTEXT, err, '删除储备融资失败');
      throw new RaxBizException('删除储备融资失败');
    } finally {
      // 释放查询运行器
      await queryRunner.release();
    }
  }

  /**
   * 将储备融资实体转换为响应 DTO
   * @param reserve 储备融资实体
   * @returns 储备融资基本信息响应对象
   */
  private convertToBaseInfoDto(reserve: FinReserve): ReserveBaseInfoDto {
    const baseInfo = new ReserveBaseInfoDto();
    baseInfo.id = reserve.id;
    baseInfo.code = reserve.code;
    baseInfo.orgId = reserve.orgId;
    baseInfo.financialInstitution = reserve.financialInstitution;
    baseInfo.fundingMode = reserve.fundingMode;
    // 将分转换为万元
    baseInfo.fundingAmount = reserve.fundingAmount / 1000000;
    baseInfo.expectedDisbursementDate = reserve.expectedDisbursementDate;
    baseInfo.loanRenewalFromId = reserve.loanRenewalFromId;
    baseInfo.leaderName = reserve.leaderName;
    baseInfo.leaderId = reserve.leaderId;
    baseInfo.executorName = reserve.executorName;
    baseInfo.executorId = reserve.executorId;
    baseInfo.combinedRatio = reserve.combinedRatio;
    // 将分转换为万元
    baseInfo.additionalCosts = reserve.additionalCosts / 1000000;
    baseInfo.status = reserve.status;
    baseInfo.createTime = reserve.createTime;
    baseInfo.createBy = reserve.createBy;
    baseInfo.updateTime = reserve.updateTime;
    baseInfo.updateBy = reserve.updateBy;
    return baseInfo;
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
    // 查询基本信息
    const reserve = await this.checkReserveExists(id);

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
    return {
      reserve: this.convertToBaseInfoDto(reserve),
      costs,
      progresses,
      progressReports
    };
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

    // 查询进度记录
    const progress = await this.finReserveProgressRepository.findOne({
      where: { id: confirmProgressDto.id }
    });

    if (!progress) {
      const errMsg = `进度记录 ${confirmProgressDto.id} 不存在`;
      this.logger.warn(this.CONTEXT, errMsg);
      throw new RaxBizException(errMsg);
    }

    // 检查是否已完成
    if (progress.actualDate) {
      const errMsg = '该进度已完成，不允许重复确认';
      this.logger.warn(this.CONTEXT, `确认进度失败: ${errMsg}`);
      throw new RaxBizException(errMsg);
    }

    // 检查实际完成日期是否有效
    if (!DateUtil.isValidDate(confirmProgressDto.actualDate)) {
      const errMsg = '实际完成日期格式无效';
      this.logger.warn(this.CONTEXT, `确认进度失败: ${errMsg}`);
      throw new RaxBizException(errMsg);
    }

    // 计算延期天数
    const delayDays = DateUtil.calculateDaysDifference(
      progress.planDate,
      confirmProgressDto.actualDate
    );

    // 更新进度记录
    progress.actualDate = confirmProgressDto.actualDate;
    progress.delayDays = delayDays;
    progress.updateBy = this.userContext.getUsername()!;
    progress.updateTime = new Date();

    // 开启事务
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 在事务中执行更新
      await queryRunner.manager.save(FinReserveProgress, progress);
      await queryRunner.commitTransaction();
      
      this.logger.info(this.CONTEXT, {
        message: '进度确认完成',
        progressId: progress.id,
        reserveId: progress.reserveId,
        progressName: progress.progressName,
        planDate: progress.planDate,
        actualDate: progress.actualDate,
        delayDays
      });
      
      return true;
    } catch (err) {
      // 发生错误时回滚事务
      await queryRunner.rollbackTransaction();
      this.logger.error(this.CONTEXT, err, '确认进度完成失败');
      throw new RaxBizException('确认进度完成失败');
    } finally {
      // 释放查询运行器
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
    // 先检查储备融资记录是否存在
    await this.checkReserveExists(reserveId);

    // 查询进度列表并按 ID 升序排列
    const progressList = await this.finReserveProgressRepository.find({
      where: { reserveId },
      order: { id: 'ASC' }
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
    await this.checkReserveExists(createProgressReportDto.reserveId);

    // 创建进度报告实体
    const progressReport = new FinReserveProgressReport();
    progressReport.id = this.snowflake.nextId();
    progressReport.reserveId = createProgressReportDto.reserveId;
    progressReport.reportContent = createProgressReportDto.reportContent;
    progressReport.createBy = this.userContext.getUsername()!;
    progressReport.createById = this.userContext.getUserId()!;
    progressReport.createTime = new Date();

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
      // 发生错误时回滚事务
      await queryRunner.rollbackTransaction();
      this.logger.error(this.CONTEXT, err, '提交进度报告失败');
      throw new RaxBizException('提交进度报告失败');
    } finally {
      // 释放查询运行器
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
    // 先检查储备融资记录是否存在
    await this.checkReserveExists(reserveId);

    // 查询进度报告列表并按创建时间倒序排列
    const progressReports = await this.finReserveProgressReportRepository.find({
      where: { reserveId },
      order: { createTime: 'DESC' }
    });

    return progressReports;
  }

  /**
   * 将储备融资实体转换为列表项 DTO
   * @param reserve 储备融资实体
   * @returns 储备融资列表项 DTO
   */
  private convertToListItemDto(reserve: FinReserve): ReserveListItemDto {
    const listItem = new ReserveListItemDto();
    listItem.id = reserve.id;
    listItem.code = reserve.code;
    listItem.orgId = reserve.orgId;
    listItem.financialInstitution = reserve.financialInstitution;
    listItem.fundingMode = reserve.fundingMode;
    // 将分转换为万元
    listItem.fundingAmount = reserve.fundingAmount / 1000000;
    listItem.combinedRatio = reserve.combinedRatio;
    listItem.expectedDisbursementDate = reserve.expectedDisbursementDate;
    listItem.leaderName = reserve.leaderName;
    listItem.executorName = reserve.executorName;
    listItem.status = reserve.status;
    return listItem;
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
    const rows = reserves.map(reserve => this.convertToListItemDto(reserve));

    // 使用 PageResult 封装结果
    return PageResult.of(searchDto.pageNo, searchDto.pageSize, total, rows);
  }
} 