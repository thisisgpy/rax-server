import { FinReserveCosts } from '../../../entities/finReserveCosts.entity';
import { FinReserveProgress } from '../../../entities/finReserveProgress.entity';
import { FinReserveProgressReport } from '../../../entities/finReserveProgressReport.entity';
import { FinReserveStatus } from '../../../entities/finReserve.entity';
import { ApiProperty } from '@nestjs/swagger';

/**
 * 储备融资基本信息响应对象
 */
export class ReserveBaseInfoDto {
  /**
   * 储备融资 ID
   */
  @ApiProperty({
    description: '储备融资ID',
    type: String
  })
  id: string;

  /**
   * 储备融资编码
   */
  @ApiProperty({
    description: '储备融资编码',
    type: String
  })
  code: string;

  /**
   * 融资主体 ID
   */
  @ApiProperty({
    description: '融资主体组织ID',
    type: String
  })
  orgId: string;

  /**
   * 金融机构
   */
  @ApiProperty({
    description: '金融机构名称',
    type: String
  })
  financialInstitution: string;

  /**
   * 融资方式
   */
  @ApiProperty({
    description: '融资方式 (例如: 信用贷款、抵押贷款等)',
    type: String
  })
  fundingMode: string;

  /**
   * 融资金额（万元）
   */
  @ApiProperty({
    description: '融资金额 (单位: 万元)',
    type: Number,
    minimum: 0
  })
  fundingAmount: number;

  /**
   * 预计放款日期
   */
  @ApiProperty({
    description: '预计放款日期',
    type: Date
  })
  expectedDisbursementDate: Date;

  /**
   * 续贷来源 ID
   */
  @ApiProperty({
    description: '续贷来源ID (0表示新增融资)',
    type: String
  })
  loanRenewalFromId: string;

  /**
   * 负责人名称
   */
  @ApiProperty({
    description: '负责人姓名',
    type: String
  })
  leaderName: string;

  /**
   * 负责人 ID
   */
  @ApiProperty({
    description: '负责人ID',
    type: String
  })
  leaderId: string;

  /**
   * 执行人名称
   */
  @ApiProperty({
    description: '执行人姓名',
    type: String
  })
  executorName: string;

  /**
   * 执行人 ID
   */
  @ApiProperty({
    description: '执行人ID',
    type: String
  })
  executorId: string;

  /**
   * 综合成本率
   */
  @ApiProperty({
    description: '综合成本率 (单位: %)',
    type: Number,
    minimum: 0
  })
  combinedRatio: number;

  /**
   * 额外成本（万元）
   */
  @ApiProperty({
    description: '附加费用 (单位: 万元)',
    type: Number,
    minimum: 0
  })
  additionalCosts: number;

  /**
   * 状态
   */
  @ApiProperty({
    description: '储备融资状态',
    enum: FinReserveStatus,
    enumName: 'FinReserveStatus'
  })
  status: FinReserveStatus;

  /**
   * 创建时间
   */
  @ApiProperty({
    description: '创建时间',
    type: Date
  })
  createTime: Date;

  /**
   * 创建人
   */
  @ApiProperty({
    description: '创建人',
    type: String
  })
  createBy: string;

  /**
   * 更新时间
   */
  @ApiProperty({
    description: '更新时间',
    type: Date
  })
  updateTime: Date;

  /**
   * 更新人
   */
  @ApiProperty({
    description: '更新人',
    type: String
  })
  updateBy: string;
}

/**
 * 储备融资详情响应对象
 */
export class ReserveDetailResponseDto {
  /**
   * 基本信息
   */
  @ApiProperty({
    description: '储备融资基本信息',
    type: ReserveBaseInfoDto
  })
  reserve: ReserveBaseInfoDto;

  /**
   * 成本构成列表
   */
  @ApiProperty({
    description: '成本明细列表',
    type: [FinReserveCosts],
    isArray: true
  })
  costs: FinReserveCosts[];

  /**
   * 进度控制列表
   */
  @ApiProperty({
    description: '进度计划列表',
    type: [FinReserveProgress],
    isArray: true
  })
  progresses: FinReserveProgress[];

  /**
   * 进度报告列表
   */
  @ApiProperty({
    description: '进度报告列表',
    type: [FinReserveProgressReport],
    isArray: true
  })
  progressReports: FinReserveProgressReport[];
} 