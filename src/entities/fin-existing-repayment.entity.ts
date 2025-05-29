import { Column, Entity, PrimaryColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('fin_existing_repayment')
export class FinExistingRepayment {
  @ApiProperty({ description: '还本付息计划 ID' })
  @PrimaryColumn({ name: 'id', comment: '还本付息计划 ID' })
  id: string;

  @ApiProperty({ description: '存量融资 ID' })
  @Column({ name: 'existing_id', comment: '存量融资 ID' })
  existingId: string;

  @ApiProperty({ description: '期数', type: 'number' })
  @Column({ name: 'period', type: 'int', comment: '期数' })
  period: number;

  @ApiProperty({ description: '结息日' })
  @Column({ name: 'interest_settle_date', type: 'date', comment: '结息日' })
  interestSettleDate: Date;

  @ApiProperty({ description: '计息天数', type: 'number' })
  @Column({ name: 'interest_calculate_date', type: 'int', comment: '计息天数' })
  interestCalculateDate: number;

  @ApiProperty({ description: '还款日期' })
  @Column({ name: 'repayment_date', type: 'date', comment: '还款日期' })
  repaymentDate: Date;

  @ApiProperty({ description: '实际还款日期' })
  @Column({ name: 'actual_repayment_date', type: 'date', comment: '实际还款日期' })
  actualRepaymentDate: Date;

  @ApiProperty({ description: '还款本金，以分计算', type: 'number' })
  @Column({ name: 'repayment_principal', type: 'bigint', comment: '还款本金，以分计算' })
  repaymentPrincipal: number;

  @ApiProperty({ description: '还款利息，以分计算', type: 'number' })
  @Column({ name: 'repayment_interest', type: 'bigint', comment: '还款利息，以分计算' })
  repaymentInterest: number;

  @ApiProperty({ description: '还款总额，以分计算', type: 'number' })
  @Column({ name: 'repayment_amount', type: 'bigint', comment: '还款总额，以分计算' })
  repaymentAmount: number;

  @ApiProperty({ description: '是否已还款. 0: 否, 1: 是', default: false })
  @Column({ name: 'is_repaid', type: 'boolean', default: false, comment: '是否已还款. 0: 否, 1: 是' })
  isRepaid: boolean;

  @ApiProperty({ description: '创建时间' })
  @Column({ name: 'create_time', type: 'datetime', default: () => 'CURRENT_TIMESTAMP', comment: '创建时间' })
  createTime: Date;

  @ApiProperty({ description: '创建人' })
  @Column({ name: 'create_by', comment: '创建人' })
  createBy: string;

  @ApiProperty({ description: '信息更新时间', required: false })
  @Column({ name: 'update_time', type: 'datetime', nullable: true, onUpdate: 'CURRENT_TIMESTAMP', comment: '信息更新时间' })
  updateTime: Date;

  @ApiProperty({ description: '信息更新人', required: false })
  @Column({ name: 'update_by', nullable: true, comment: '信息更新人' })
  updateBy: string;
} 