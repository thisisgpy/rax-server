import { Column, Entity, PrimaryColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('fin_existing_disbursement')
export class FinExistingDisbursement {
  @ApiProperty({ description: '融资放款 ID' })
  @PrimaryColumn({ name: 'id', comment: '融资放款 ID' })
  id: string;

  @ApiProperty({ description: '存量融资 ID' })
  @Column({ name: 'existing_id', comment: '存量融资 ID' })
  existingId: string;

  @ApiProperty({ description: '放款金额，以分计算', type: 'number' })
  @Column({ name: 'amount', type: 'bigint', comment: '放款金额，以分计算' })
  amount: number;

  @ApiProperty({ description: '到账日期' })
  @Column({ name: 'accounting_date', type: 'date', comment: '到账日期' })
  accountingDate: Date;

  @ApiProperty({ description: '放款方式' })
  @Column({ name: 'disbursement_method', comment: '放款方式' })
  disbursementMethod: string;

  @ApiProperty({ description: '起息日' })
  @Column({ name: 'interest_start_date', type: 'date', comment: '起息日' })
  interestStartDate: Date;

  @ApiProperty({ description: '首次还款日' })
  @Column({ name: 'first_repayment_date', type: 'date', comment: '首次还款日' })
  firstRepaymentDate: Date;

  @ApiProperty({ description: '最后还款日' })
  @Column({ name: 'last_repayment_date', type: 'date', comment: '最后还款日' })
  lastRepaymentDate: Date;

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