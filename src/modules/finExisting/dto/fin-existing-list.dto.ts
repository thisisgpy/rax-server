import { ApiProperty } from '@nestjs/swagger';

export class FinExistingListItemDto {

  @ApiProperty({ description: '存量融资 ID' })
  id: string;

  @ApiProperty({ description: '融资台账编码' })
  code: string;

  @ApiProperty({ description: '储备融资 ID' })
  reserveId: string;

  @ApiProperty({ description: '融资主体 ID' })
  orgId: string;

  @ApiProperty({ description: '融资主体编码' })
  orgCode: string;

  @ApiProperty({ description: '融资名称' })
  finName: string;

  @ApiProperty({ description: '融资结构' })
  fundingStructure: string;

  @ApiProperty({ description: '融资方式' })
  fundingMode: string;

  @ApiProperty({ description: '金融机构' })
  financialInstitution: string;

  @ApiProperty({ description: '融资总额（分）', type: String })
  fundingAmount: string;

  @ApiProperty({ description: '回报利率', type: Number, required: false })
  returnInterestRate?: number;

  @ApiProperty({ description: '还款周期.1:月,2:季,3:半年,4:年,5:到期一次性付,6:自行协商', type: Number, enum: [1, 2, 3, 4, 5, 6], required: false })
  repaymentPeriod?: number;

  @ApiProperty({ description: '还款方式.1:等额本息,2:分期还本付息,3:先息后本,4:到期一次性还本付息,5:其他', type: Number, enum: [1, 2, 3, 4, 5], required: false })
  repaymentMethod?: number;

  @ApiProperty({ description: '利息类型.1:固定利率,2:浮动利率', type: Number, enum: [1, 2], required: false })
  interestType?: number;

  @ApiProperty({ description: '基准利率', type: Number, required: false })
  loanPrimeRate?: number;

  @ApiProperty({ description: '基点', type: Number, required: false })
  basisPoint?: number;

  @ApiProperty({ description: '计息基准.1:ACT/365,2:ACT/366,3:ACT/360,4:30/360', type: Number, enum: [1, 2, 3, 4], required: false })
  daysCountBasis?: number;

  @ApiProperty({ description: '结息日当日是否计息. 0: 否, 1: 是', default: false })
  includeSettlementDate: boolean;

  @ApiProperty({ description: '还款日相对于结息日的延迟天数', type: Number, default: 0 })
  repaymentDelayDays: number;

  @ApiProperty({ description: '续贷来源 ID' })
  loanRenewalFromId: string;

  @ApiProperty({ description: '是否为多次放款' })
  isMultiple: boolean;

  @ApiProperty({ description: '融资期限（月）' })
  finTerm: number;

  @ApiProperty({ description: '是否为公开融资' })
  isPublic: boolean;

  @ApiProperty({ description: '创建时间' })
  createTime: Date;

  @ApiProperty({ description: '创建人' })
  createBy: string;

  @ApiProperty({ description: '更新时间' })
  updateTime: Date;

  @ApiProperty({ description: '更新人' })
  updateBy: string;
} 