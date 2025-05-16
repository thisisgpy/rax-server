import { FinReserveCosts } from '../../../entities/finReserveCosts.entity';
import { FinReserveProgress } from '../../../entities/finReserveProgress.entity';
import { FinReserveProgressReport } from '../../../entities/finReserveProgressReport.entity';
import { FinReserveStatus } from '../../../entities/finReserve.entity';

/**
 * 储备融资基本信息响应对象
 */
export class ReserveBaseInfoDto {
  /**
   * 储备融资 ID
   */
  id: string;

  /**
   * 储备融资编码
   */
  code: string;

  /**
   * 融资主体 ID
   */
  orgId: string;

  /**
   * 金融机构
   */
  financialInstitution: string;

  /**
   * 融资方式
   */
  fundingMode: string;

  /**
   * 融资金额（万元）
   */
  fundingAmount: number;

  /**
   * 预计放款日期
   */
  expectedDisbursementDate: Date;

  /**
   * 续贷来源 ID
   */
  loanRenewalFromId: string;

  /**
   * 负责人名称
   */
  leaderName: string;

  /**
   * 负责人 ID
   */
  leaderId: string;

  /**
   * 执行人名称
   */
  executorName: string;

  /**
   * 执行人 ID
   */
  executorId: string;

  /**
   * 综合成本率
   */
  combinedRatio: number;

  /**
   * 额外成本（万元）
   */
  additionalCosts: number;

  /**
   * 状态
   */
  status: FinReserveStatus;

  /**
   * 创建时间
   */
  createTime: Date;

  /**
   * 创建人
   */
  createBy: string;

  /**
   * 更新时间
   */
  updateTime: Date;

  /**
   * 更新人
   */
  updateBy: string;
}

/**
 * 储备融资详情响应对象
 */
export class ReserveDetailResponseDto {
  /**
   * 基本信息
   */
  reserve: ReserveBaseInfoDto;

  /**
   * 成本构成列表
   */
  costs: FinReserveCosts[];

  /**
   * 进度控制列表
   */
  progresses: FinReserveProgress[];

  /**
   * 进度报告列表
   */
  progressReports: FinReserveProgressReport[];
} 