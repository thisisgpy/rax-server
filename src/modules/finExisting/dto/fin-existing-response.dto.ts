import { ApiProperty } from '@nestjs/swagger';
import { 
    InstitutionTypeEnum, 
    RepaymentMethodEnum, 
    RepaymentPeriodEnum, 
    InterestTypeEnum, 
    DaysCountBasisEnum 
} from '../../../common/enums';

export class FinExistingResponseDto {
    @ApiProperty({ description: '存量融资ID', type: String })
    id: string;

    @ApiProperty({ description: '存量融资编码', type: String })
    code: string;

    @ApiProperty({ description: '储备融资ID', type: String })
    reserveId: string;

    @ApiProperty({ description: '融资主体ID', type: String })
    orgId: string;

    @ApiProperty({ description: '融资主体编码', type: String })
    orgCode: string;

    @ApiProperty({ description: '融资主体名称', type: String })
    orgName: string;

    @ApiProperty({ description: '融资名称', type: String })
    finName: string;

    @ApiProperty({ description: '融资结构', type: String })
    fundingStructure: string;

    @ApiProperty({ description: '融资方式', type: String })
    fundingMode: string;

    @ApiProperty({ description: '金融机构类型', enum: InstitutionTypeEnum })
    institutionType: InstitutionTypeEnum;

    @ApiProperty({ description: '金融机构ID', type: String })
    financialInstitutionId: string;

    @ApiProperty({ description: '金融机构名称', type: String })
    financialInstitutionName: string;

    @ApiProperty({ description: '融资总额(分)', type: String })
    fundingAmount: string;

    @ApiProperty({ description: '放款总额(分)', type: String })
    disbursementAmount: string;

    @ApiProperty({ description: '回报利率', type: Number })
    returnInterestRate: number;

    @ApiProperty({ description: '还款周期', enum: RepaymentPeriodEnum })
    repaymentPeriod: RepaymentPeriodEnum;

    @ApiProperty({ description: '还款方式', enum: RepaymentMethodEnum })
    repaymentMethod: RepaymentMethodEnum;

    @ApiProperty({ description: '利率类型', enum: InterestTypeEnum })
    interestType: InterestTypeEnum;

    @ApiProperty({ description: '基准利率', type: Number })
    loanPrimeRate: number;

    @ApiProperty({ description: '基点', type: Number })
    basisPoint: number;

    @ApiProperty({ description: '计息基准', enum: DaysCountBasisEnum })
    daysCountBasis: DaysCountBasisEnum;

    @ApiProperty({ description: '结息日当日是否计息', type: Boolean })
    includeSettlementDate: boolean;

    @ApiProperty({ description: '还款日相对于结息日的延迟天数', type: Number })
    repaymentDelayDays: number;

    @ApiProperty({ description: '续贷来源ID', type: String })
    loanRenewalFromId: string;

    @ApiProperty({ description: '是否为多次放款', type: Boolean })
    isMultiple: boolean;

    @ApiProperty({ description: '融资期限(月)', type: Number })
    finTerm: number;

    @ApiProperty({ description: '融资到期日', type: Date })
    maturityDate: Date;

    @ApiProperty({ description: '是否为公开融资', type: Boolean })
    isPublic: boolean;

    @ApiProperty({ description: '创建时间', type: Date })
    createTime: Date;

    @ApiProperty({ description: '创建人', type: String })
    createBy: string;

    @ApiProperty({ description: '更新时间', type: Date })
    updateTime: Date;

    @ApiProperty({ description: '更新人', type: String })
    updateBy: string;
}

export class FinExistingListItemDto {
    @ApiProperty({ description: '存量融资ID', type: String })
    id: string;

    @ApiProperty({ description: '存量融资编码', type: String })
    code: string;

    @ApiProperty({ description: '融资主体ID', type: String })
    orgId: string;

    @ApiProperty({ description: '融资主体名称', type: String })
    orgName: string;

    @ApiProperty({ description: '融资方式', type: String })
    fundingMode: string;

    @ApiProperty({ description: '金融机构名称', type: String })
    financialInstitutionName: string;

    @ApiProperty({ description: '融资总额(分)', type: String })
    fundingAmount: string;

    @ApiProperty({ description: '放款总额(分)', type: String })
    disbursementAmount: string;

    @ApiProperty({ description: '融资期限(月)', type: Number })
    finTerm: number;

    @ApiProperty({ description: '创建时间', type: Date })
    createTime: Date;
} 