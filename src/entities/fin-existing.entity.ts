import { Column, Entity, PrimaryColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('fin_existing')
export class FinExisting {
  @ApiProperty({ description: '存量融资 ID' })
  @PrimaryColumn({ name: 'id', comment: '存量融资 ID' })
  id: string;

  @ApiProperty({ description: '存量融资编码. 编码规则: EF 开头，后面跟 yyMMddHHmmss' })
  @Column({ name: 'code', comment: '存量融资编码. 编码规则: EF 开头，后面跟 yyMMddHHmmss' })
  code: string;

  @ApiProperty({ description: '储备融资 ID. 0 表示非储备融资转入' })
  @Column({ name: 'reserve_id', comment: '储备融资 ID. 0 表示非储备融资转入' })
  reserveId: string;

  @ApiProperty({ description: '融资主体 ID' })
  @Column({ name: 'org_id', comment: '融资主体 ID' })
  orgId: string;

  @ApiProperty({ description: '融资主体编码' })
  @Column({ name: 'org_code', comment: '融资主体编码' })
  orgCode: string;

  @ApiProperty({ description: '融资名称' })
  @Column({ name: 'fin_name', comment: '融资名称' })
  finName: string;

  @ApiProperty({ description: '融资结构' })
  @Column({ name: 'funding_structure', comment: '融资结构' })
  fundingStructure: string;

  @ApiProperty({ description: '融资方式' })
  @Column({ name: 'funding_mode', comment: '融资方式' })
  fundingMode: string;

  @ApiProperty({ description: '金融机构' })
  @Column({ name: 'financial_institution', comment: '金融机构' })
  financialInstitution: string;

  @ApiProperty({ description: '融资总额，以分计算', type: 'number' })
  @Column({ name: 'funding_amount', type: 'bigint', comment: '融资总额，以分计算' })
  fundingAmount: number;

  @ApiProperty({ description: '回报利率', type: 'number' })
  @Column({ 
    name: 'return_interest_rate', 
    type: 'decimal', 
    precision: 8, 
    scale: 4, 
    nullable: true, 
    comment: '回报利率'
  })
  returnInterestRate: number;

  @ApiProperty({ description: '还款周期.1:月,2:季,3:半年,4:年,5:到期一次性付,6:自行协商', type: 'number', enum: [1, 2, 3, 4, 5, 6] })
  @Column({ name: 'repayment_period', type: 'tinyint', nullable: true, comment: '还款周期.1:月,2:季,3:半年,4:年,5:到期一次性付,6:自行协商' })
  repaymentPeriod: number;

  @ApiProperty({ description: '还款方式.1:等额本息,2:分期还本付息,3:先息后本,4:到期一次性还本付息,5:其他', type: 'number', enum: [1, 2, 3, 4, 5] })
  @Column({ name: 'repayment_method', type: 'tinyint', nullable: true, comment: '还款方式.1:等额本息,2:分期还本付息,3:先息后本,4:到期一次性还本付息,5:其他' })
  repaymentMethod: number;

  @ApiProperty({ description: '利息类型.1:固定利率,2:浮动利率', type: 'number', enum: [1, 2] })
  @Column({ name: 'interest_type', type: 'tinyint', nullable: true, comment: '利息类型.1:固定利率,2:浮动利率' })
  interestType: number;

  @ApiProperty({ description: '基准利率', type: 'number' })
  @Column({ 
    name: 'loan_prime_rate', 
    type: 'decimal', 
    precision: 8, 
    scale: 4, 
    nullable: true, 
    comment: '基准利率'
  })
  loanPrimeRate: number;

  @ApiProperty({ description: '基点', type: 'number' })
  @Column({ 
    name: 'basis_point', 
    type: 'decimal', 
    precision: 8, 
    scale: 4, 
    nullable: true, 
    comment: '基点'
  })
  basisPoint: number;

  @ApiProperty({ description: '计息基准.1:ACT/365,2:ACT/366,3:ACT/360,4:30/360', type: 'number', enum: [1, 2, 3, 4] })
  @Column({ name: 'days_count_basis', type: 'tinyint', nullable: true, comment: '计息基准.1:ACT/365,2:ACT/366,3:ACT/360,4:30/360' })
  daysCountBasis: number;

  @ApiProperty({ description: '结息日当日是否计息. 0: 否, 1: 是', default: false })
  @Column({ name: 'include_settlement_date', type: 'boolean', default: false, comment: '结息日当日是否计息. 0: 否, 1: 是' })
  includeSettlementDate: boolean;

  @ApiProperty({ description: '还款日相对于结息日的延迟天数', type: 'number', default: 0 })
  @Column({ name: 'repayment_delay_days', type: 'int', default: 0, comment: '还款日相对于结息日的延迟天数' })
  repaymentDelayDays: number;

  @ApiProperty({ description: '续贷来源 ID.0 表示非续贷' })
  @Column({ name: 'loan_renewal_from_id', comment: '续贷来源 ID.0 表示非续贷' })
  loanRenewalFromId: string;

  @ApiProperty({ description: '是否为多次放款. 0: 否, 1: 是', default: false })
  @Column({ name: 'is_multiple', type: 'boolean', default: false, comment: '是否为多次放款. 0: 否, 1: 是' })
  isMultiple: boolean;

  @ApiProperty({ description: '融资期限，以月为单位', type: 'number' })
  @Column({ name: 'fin_term', type: 'int', comment: '融资期限，以月为单位' })
  finTerm: number;

  @ApiProperty({ description: '是否为公开融资. 0: 否, 1: 是', default: false })
  @Column({ name: 'is_public', type: 'boolean', default: false, comment: '是否为公开融资. 0: 否, 1: 是' })
  isPublic: boolean;

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

  @ApiProperty({ description: '是否删除. 0: 否, 1: 是', default: false })
  @Column({ name: 'is_deleted', type: 'boolean', default: false, comment: '是否删除. 0: 否, 1: 是' })
  isDeleted: boolean;
} 