import { 
    IsNotEmpty, 
    IsString, 
    IsOptional, 
    IsNumber, 
    IsEnum, 
    IsBoolean, 
    IsDateString, 
    IsArray, 
    MaxLength, 
    Min, 
    Matches,
    ValidateNested
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { 
    InstitutionTypeEnum, 
    RepaymentMethodEnum, 
    RepaymentPeriodEnum, 
    InterestTypeEnum, 
    DaysCountBasisEnum 
} from '../../../common/enums';
import { CreateDisbursementDto } from './create-disbursement.dto';
import { CreateGuaranteeDto } from './create-guarantee.dto';
import { CreateLinkageDto } from './create-linkage.dto';

export class CreateFinExistingDto {
    @ApiProperty({
        description: '储备融资ID',
        type: Number,
        required: false
    })
    @IsOptional()
    @IsNumber({}, { message: '储备融资ID必须是数字' })
    @Min(0, { message: '储备融资ID不能小于0' })
    reserveId?: number = 0;

    @ApiProperty({
        description: '融资主体ID',
        type: Number
    })
    @IsNotEmpty({ message: '融资主体ID不能为空' })
    @IsNumber({}, { message: '融资主体ID必须是数字' })
    @Min(1, { message: '融资主体ID必须大于0' })
    orgId: number;

    @ApiProperty({
        description: '融资名称',
        type: String,
        maxLength: 64
    })
    @IsOptional()
    @IsString({ message: '融资名称必须是字符串' })
    @MaxLength(64, { message: '融资名称不能超过64个字符' })
    finName?: string;

    @ApiProperty({
        description: '融资结构',
        type: String,
        maxLength: 64,
        required: false
    })
    @IsOptional()
    @IsString({ message: '融资结构必须是字符串' })
    @MaxLength(64, { message: '融资结构不能超过64个字符' })
    fundingStructure?: string;

    @ApiProperty({
        description: '融资方式',
        type: String,
        maxLength: 64,
        required: false
    })
    @IsOptional()
    @IsString({ message: '融资方式必须是字符串' })
    @MaxLength(64, { message: '融资方式不能超过64个字符' })
    fundingMode?: string;

    @ApiProperty({
        description: '金融机构类型',
        enum: InstitutionTypeEnum,
        required: false
    })
    @IsOptional()
    @IsEnum(InstitutionTypeEnum, { message: '金融机构类型不正确' })
    institutionType?: InstitutionTypeEnum;

    @ApiProperty({
        description: '金融机构ID',
        type: Number,
        required: false
    })
    @IsOptional()
    @IsNumber({}, { message: '金融机构ID必须是数字' })
    @Min(1, { message: '金融机构ID必须大于0' })
    financialInstitutionId?: number;

    @ApiProperty({
        description: '金融机构名称',
        type: String,
        maxLength: 64,
        required: false
    })
    @IsOptional()
    @IsString({ message: '金融机构名称必须是字符串' })
    @MaxLength(64, { message: '金融机构名称不能超过64个字符' })
    financialInstitutionName?: string;

    @ApiProperty({
        description: '融资总额 (单位: 万元)',
        type: String,
        example: '1000.50'
    })
    @IsNotEmpty({ message: '融资总额不能为空' })
    @IsString({ message: '融资总额必须是字符串' })
    @Matches(/^\d+(\.\d{1,6})?$/, { message: '融资总额格式不正确，支持最多6位小数' })
    fundingAmount: string;

    @ApiProperty({
        description: '回报利率',
        type: Number,
        required: false
    })
    @IsOptional()
    @IsNumber({}, { message: '回报利率必须是数字' })
    @Min(0, { message: '回报利率不能小于0' })
    returnInterestRate?: number;

    @ApiProperty({
        description: '还款周期',
        enum: RepaymentPeriodEnum,
        required: false
    })
    @IsOptional()
    @IsEnum(RepaymentPeriodEnum, { message: '还款周期不正确' })
    repaymentPeriod?: RepaymentPeriodEnum;

    @ApiProperty({
        description: '还款方式',
        enum: RepaymentMethodEnum,
        required: false
    })
    @IsOptional()
    @IsEnum(RepaymentMethodEnum, { message: '还款方式不正确' })
    repaymentMethod?: RepaymentMethodEnum;

    @ApiProperty({
        description: '利率类型',
        enum: InterestTypeEnum,
        required: false
    })
    @IsOptional()
    @IsEnum(InterestTypeEnum, { message: '利率类型不正确' })
    interestType?: InterestTypeEnum;

    @ApiProperty({
        description: '基准利率',
        type: Number,
        required: false
    })
    @IsOptional()
    @IsNumber({}, { message: '基准利率必须是数字' })
    @Min(0, { message: '基准利率不能小于0' })
    loanPrimeRate?: number;

    @ApiProperty({
        description: '基点',
        type: Number,
        required: false
    })
    @IsOptional()
    @IsNumber({}, { message: '基点必须是数字' })
    basisPoint?: number;

    @ApiProperty({
        description: '计息基准',
        enum: DaysCountBasisEnum,
        required: false
    })
    @IsOptional()
    @IsEnum(DaysCountBasisEnum, { message: '计息基准不正确' })
    daysCountBasis?: DaysCountBasisEnum;

    @ApiProperty({
        description: '结息日当日是否计息',
        type: Boolean,
        required: false
    })
    @IsOptional()
    @IsBoolean({ message: '结息日当日是否计息必须是布尔值' })
    includeSettlementDate?: boolean;

    @ApiProperty({
        description: '还款日相对于结息日的延迟天数',
        type: Number,
        required: false,
        default: 0
    })
    @IsOptional()
    @IsNumber({}, { message: '还款延迟天数必须是数字' })
    @Min(0, { message: '还款延迟天数不能小于0' })
    repaymentDelayDays?: number = 0;

    @ApiProperty({
        description: '续贷来源ID',
        type: Number,
        required: false,
        default: 0
    })
    @IsOptional()
    @IsNumber({}, { message: '续贷来源ID必须是数字' })
    @Min(0, { message: '续贷来源ID不能小于0' })
    loanRenewalFromId?: number = 0;

    @ApiProperty({
        description: '是否为多次放款',
        type: Boolean,
        required: false,
        default: false
    })
    @IsOptional()
    @IsBoolean({ message: '是否为多次放款必须是布尔值' })
    isMultiple?: boolean = false;

    @ApiProperty({
        description: '融资期限 (月)',
        type: Number,
        required: false
    })
    @IsOptional()
    @IsNumber({}, { message: '融资期限必须是数字' })
    @Min(1, { message: '融资期限必须大于0' })
    finTerm?: number;

    @ApiProperty({
        description: '融资到期日',
        type: Date,
        example: '2026-01-15'
    })
    @IsOptional()
    @IsDateString({}, { message: '融资到期日格式不正确' })
    @Type(() => Date)
    maturityDate?: Date;

    @ApiProperty({
        description: '是否为公开融资',
        type: Boolean,
        required: false,
        default: true
    })
    @IsOptional()
    @IsBoolean({ message: '是否为公开融资必须是布尔值' })
    isPublic?: boolean = true;

    // 关联数据
    @ApiProperty({
        description: '放款记录列表',
        type: [CreateDisbursementDto],
        required: false
    })
    @IsOptional()
    @IsArray({ message: '放款记录必须是数组' })
    @ValidateNested({ each: true })
    @Type(() => CreateDisbursementDto)
    disbursements?: CreateDisbursementDto[];

    @ApiProperty({
        description: '担保记录列表',
        type: [CreateGuaranteeDto],
        required: false
    })
    @IsOptional()
    @IsArray({ message: '担保记录必须是数组' })
    @ValidateNested({ each: true })
    @Type(() => CreateGuaranteeDto)
    guarantees?: CreateGuaranteeDto[];

    @ApiProperty({
        description: '勾稽关系列表',
        type: [CreateLinkageDto],
        required: false
    })
    @IsOptional()
    @IsArray({ message: '勾稽关系必须是数组' })
    @ValidateNested({ each: true })
    @Type(() => CreateLinkageDto)
    linkages?: CreateLinkageDto[];
} 