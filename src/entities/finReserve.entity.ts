import { Column, Entity, PrimaryColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

/**
 * 储备融资状态枚举
 */
export enum FinReserveStatus {
  /**
   * 待放款
   */
  PENDING = 0,

  /**
   * 已放款
   */
  DISBURSED = 1,

  /**
   * 已取消
   */
  CANCELLED = 2,
}

@Entity('fin_reserve')
export class FinReserve {
  @ApiProperty({
    description: '储备融资ID'
  })
  @PrimaryColumn({ name: 'id', comment: '储备融资 ID' })
  id: string;

  @ApiProperty({
    description: '储备融资编码'
  })
  @Column({ name: 'code', comment: '储备融资编码.编码规则: RF 开头，后面跟 yyMMddHHmmss' })
  code: string;

  @ApiProperty({
    description: '融资主体ID'
  })
  @Column({ name: 'org_id', comment: '融资主体 ID' })
  orgId: string;

  @ApiProperty({
    description: '金融机构'
  })
  @Column({ name: 'financial_institution', comment: '金融机构' })
  financialInstitution: string;

  @ApiProperty({
    description: '融资方式'
  })
  @Column({ name: 'funding_mode', comment: '融资方式' })
  fundingMode: string;

  @ApiProperty({
    description: '融资金额(分)'
  })
  @Column({ name: 'funding_amount', type: 'bigint', comment: '融资金额，以分计算' })
  fundingAmount: number;

  @ApiProperty({
    description: '预计放款日期'
  })
  @Column({ name: 'expected_disbursement_date', type: 'date', comment: '预计放款日期' })
  expectedDisbursementDate: Date;

  @ApiProperty({
    description: '续贷来源ID'
  })
  @Column({ name: 'loan_renewal_from_id', comment: '续贷来源 ID.0 表示非续贷' })
  loanRenewalFromId: string;

  @ApiProperty({
    description: '负责人姓名'
  })
  @Column({ name: 'leader_name', comment: '负责人名称' })
  leaderName: string;

  @ApiProperty({
    description: '负责人ID'
  })
  @Column({ name: 'leader_id', comment: '负责人 ID' })
  leaderId: string;

  @ApiProperty({
    description: '执行人姓名'
  })
  @Column({ name: 'executor_name', comment: '执行人名称' })
  executorName: string;

  @ApiProperty({
    description: '执行人ID'
  })
  @Column({ name: 'executor_id', comment: '执行人 ID' })
  executorId: string;

  @ApiProperty({
    description: '综合成本率(%)'
  })
  @Column({ name: 'combined_ratio', type: 'decimal', precision: 6, scale: 2, comment: '综合成本率' })
  combinedRatio: number;

  @ApiProperty({
    description: '额外成本(分)'
  })
  @Column({ name: 'additional_costs', type: 'bigint', comment: '额外成本，以分计算' })
  additionalCosts: number;

  @ApiProperty({
    description: '状态',
    enum: FinReserveStatus,
    enumName: 'FinReserveStatus'
  })
  @Column({ 
    name: 'status', 
    type: 'tinyint', 
    comment: '状态. 0:待放款, 1:已放款, 2:已取消',
    enum: FinReserveStatus,
    default: FinReserveStatus.PENDING
  })
  status: FinReserveStatus;

  @ApiProperty({
    description: '创建时间'
  })
  @Column({ name: 'create_time', type: 'datetime', comment: '创建时间' })
  createTime: Date;

  @ApiProperty({
    description: '创建人'
  })
  @Column({ name: 'create_by', comment: '创建人' })
  createBy: string;

  @ApiProperty({
    description: '更新时间'
  })
  @Column({ name: 'update_time', type: 'datetime', comment: '信息更新时间' })
  updateTime: Date;

  @ApiProperty({
    description: '更新人'
  })
  @Column({ name: 'update_by', comment: '信息更新人' })
  updateBy: string;
} 