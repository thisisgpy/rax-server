import { Injectable, Inject } from '@nestjs/common';
import { FinReserve, FinReserveStatus } from 'src/entities/finReserve.entity';
import { FinReserveCosts } from 'src/entities/finReserveCosts.entity';
import { FinReserveProgress } from 'src/entities/finReserveProgress.entity';
import { FinReserveProgressReport } from 'src/entities/finReserveProgressReport.entity';
import { CreateReserveDto } from '../dto/create-reserve.dto';
import { UpdateReserveDto } from '../dto/update-reserve.dto';
import { CreateProgressReportDto } from '../dto/create-progress-report.dto';
import { FinReserveConverter } from '../converters/fin-reserve.converter';
import { Snowflake } from 'src/common/utils/snowflake';
import { UserContext } from 'src/common/context/user-context';
import { CodeUtil } from 'src/common/utils/code.util';
import { DateUtil } from 'src/common/utils/date.util';
import { SNOWFLAKE } from 'src/common/providers';

/**
 * 融资储备实体工厂
 * 负责创建和更新各种实体对象
 */
@Injectable()
export class FinReserveFactory {

  constructor(
    private readonly converter: FinReserveConverter,
    @Inject(SNOWFLAKE)
    private readonly snowflake: Snowflake,
    @Inject('UserContext')
    private readonly userContext: UserContext,
  ) {}

  /**
   * 创建储备融资基本信息实体
   * @param createReserveDto 创建储备融资的数据传输对象
   * @param reserveId 储备融资ID
   * @returns {FinReserve} 储备融资实体
   */
  createReserveEntity(createReserveDto: CreateReserveDto, reserveId: string): FinReserve {
    const reserve = new FinReserve();
    reserve.id = reserveId;
    reserve.code = CodeUtil.generateReserveCode();
    reserve.orgId = createReserveDto.orgId;
    reserve.financialInstitution = createReserveDto.financialInstitution;
    reserve.fundingMode = createReserveDto.fundingMode;
    // 将万元转换为分
    reserve.fundingAmount = this.converter.convertWanToCent(createReserveDto.fundingAmount);
    reserve.expectedDisbursementDate = createReserveDto.expectedDisbursementDate;
    reserve.loanRenewalFromId = createReserveDto.loanRenewalFromId;
    reserve.leaderName = createReserveDto.leaderName;
    reserve.leaderId = createReserveDto.leaderId;
    reserve.executorName = createReserveDto.executorName;
    reserve.executorId = createReserveDto.executorId;
    reserve.combinedRatio = createReserveDto.combinedRatio;
    // 将万元转换为分
    reserve.additionalCosts = this.converter.convertWanToCent(createReserveDto.additionalCosts);
    reserve.status = FinReserveStatus.PENDING; // 待放款状态
    reserve.createBy = this.userContext.getUsername()!;
    reserve.createTime = new Date();
    return reserve;
  }

  /**
   * 更新储备融资基本信息实体
   * @param updateReserveDto 更新储备融资的数据传输对象
   * @param existingReserve 现有的储备融资实体
   * @returns {FinReserve} 更新后的储备融资实体
   */
  updateReserveEntity(updateReserveDto: UpdateReserveDto, existingReserve: FinReserve): FinReserve {
    existingReserve.orgId = updateReserveDto.orgId;
    existingReserve.financialInstitution = updateReserveDto.financialInstitution;
    existingReserve.fundingMode = updateReserveDto.fundingMode;
    existingReserve.fundingAmount = this.converter.convertWanToCent(updateReserveDto.fundingAmount);
    existingReserve.expectedDisbursementDate = updateReserveDto.expectedDisbursementDate;
    existingReserve.loanRenewalFromId = updateReserveDto.loanRenewalFromId;
    existingReserve.leaderName = updateReserveDto.leaderName;
    existingReserve.leaderId = updateReserveDto.leaderId;
    existingReserve.executorName = updateReserveDto.executorName;
    existingReserve.executorId = updateReserveDto.executorId;
    existingReserve.combinedRatio = updateReserveDto.combinedRatio;
    existingReserve.additionalCosts = this.converter.convertWanToCent(updateReserveDto.additionalCosts);
    existingReserve.updateBy = this.userContext.getUsername()!;
    existingReserve.updateTime = new Date();
    return existingReserve;
  }

  /**
   * 创建储备融资成本明细实体列表
   * @param costDetails 成本明细数据列表
   * @param reserveId 储备融资ID
   * @returns {FinReserveCosts[]} 成本明细实体列表
   */
  createCostEntities(costDetails: CreateReserveDto['costDetails'], reserveId: string): FinReserveCosts[] {
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
   * @returns {FinReserveProgress[]} 进度控制实体列表
   */
  createProgressEntities(progressList: CreateReserveDto['progressList'], reserveId: string): FinReserveProgress[] {
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
   * 创建进度报告实体
   * @param createProgressReportDto 进度报告数据
   * @returns {FinReserveProgressReport} 进度报告实体
   */
  createProgressReportEntity(createProgressReportDto: CreateProgressReportDto): FinReserveProgressReport {
    const progressReport = new FinReserveProgressReport();
    progressReport.id = this.snowflake.nextId();
    progressReport.reserveId = createProgressReportDto.reserveId;
    progressReport.reportContent = createProgressReportDto.reportContent;
    progressReport.createBy = this.userContext.getUsername()!;
    progressReport.createById = this.userContext.getUserId()!;
    progressReport.createTime = new Date();
    return progressReport;
  }

  /**
   * 创建取消原因进度报告实体
   * @param reserveId 储备融资ID
   * @param cancelReason 取消原因
   * @returns {FinReserveProgressReport} 进度报告实体
   */
  createCancelReportEntity(reserveId: string, cancelReason: string): FinReserveProgressReport {
    const progressReport = new FinReserveProgressReport();
    progressReport.id = this.snowflake.nextId();
    progressReport.reserveId = reserveId;
    progressReport.reportContent = `取消原因：${cancelReason}`;
    progressReport.createBy = this.userContext.getUsername()!;
    progressReport.createById = this.userContext.getUserId()!;
    progressReport.createTime = new Date();
    return progressReport;
  }

  /**
   * 更新储备融资状态为已取消
   * @param existingReserve 现有储备融资实体
   * @returns {FinReserve} 更新后的储备融资实体
   */
  updateReserveStatusToCancelled(existingReserve: FinReserve): FinReserve {
    existingReserve.status = FinReserveStatus.CANCELLED;
    existingReserve.updateBy = this.userContext.getUsername()!;
    existingReserve.updateTime = new Date();
    return existingReserve;
  }

  /**
   * 更新进度记录的实际完成日期和延期天数
   * @param progress 进度记录
   * @param actualDate 实际完成日期
   * @returns {FinReserveProgress} 更新后的进度记录
   */
  updateProgressWithActualDate(progress: FinReserveProgress, actualDate: Date): FinReserveProgress {
    // 计算延期天数
    const delayDays = DateUtil.calculateDaysDifference(
      progress.planDate,
      actualDate
    );

    progress.actualDate = actualDate;
    progress.delayDays = delayDays;
    progress.updateBy = this.userContext.getUsername()!;
    progress.updateTime = new Date();
    
    return progress;
  }
} 