import { IsOptional, IsString, IsNumber, IsEnum, IsBoolean, IsDateString, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { 
    InstitutionTypeEnum, 
    RepaymentMethodEnum, 
    RepaymentPeriodEnum, 
    InterestTypeEnum 
} from '../../../common/enums';

export class QueryFinExistingDto {
    @ApiProperty({
        description: '页码',
        type: Number,
        default: 1,
        minimum: 1
    })
    @IsOptional()
    @IsNumber({}, { message: '页码必须是数字' })
    @Min(1, { message: '页码必须大于0' })
    @Type(() => Number)
    pageNo?: number = 1;

    @ApiProperty({
        description: '每页条数',
        type: Number,
        default: 10,
        minimum: 1,
        maximum: 100
    })
    @IsOptional()
    @IsNumber({}, { message: '每页条数必须是数字' })
    @Min(1, { message: '每页条数必须大于0' })
    @Max(100, { message: '每页条数不能超过100' })
    @Type(() => Number)
    pageSize?: number = 10;

    @ApiProperty({
        description: '融资主体ID',
        type: Number,
        required: false
    })
    @IsOptional()
    @IsNumber({}, { message: '融资主体ID必须是数字' })
    @Min(1, { message: '融资主体ID必须大于0' })
    @Type(() => Number)
    orgId?: number;

    @ApiProperty({
        description: '融资方式',
        type: String,
        required: false
    })
    @IsOptional()
    @IsString({ message: '融资方式必须是字符串' })
    fundingMode?: string;

    @ApiProperty({
        description: '金融机构类型',
        enum: InstitutionTypeEnum,
        required: false
    })
    @IsOptional()
    @IsEnum(InstitutionTypeEnum, { message: '金融机构类型不正确' })
    @Type(() => Number)
    institutionType?: InstitutionTypeEnum;

    @ApiProperty({
        description: '金融机构名称',
        type: String,
        required: false
    })
    @IsOptional()
    @IsString({ message: '金融机构名称必须是字符串' })
    financialInstitutionName?: string;

    @ApiProperty({
        description: '融资总额最小值 (单位: 万元)',
        type: String,
        required: false,
        example: '100.00'
    })
    @IsOptional()
    @IsString({ message: '融资总额最小值必须是字符串' })
    fundingAmountMin?: string;

    @ApiProperty({
        description: '融资总额最大值 (单位: 万元)',
        type: String,
        required: false,
        example: '1000.00'
    })
    @IsOptional()
    @IsString({ message: '融资总额最大值必须是字符串' })
    fundingAmountMax?: string;

    @ApiProperty({
        description: '回报利率最小值',
        type: Number,
        required: false
    })
    @IsOptional()
    @IsNumber({}, { message: '回报利率最小值必须是数字' })
    @Min(0, { message: '回报利率最小值不能小于0' })
    @Type(() => Number)
    returnInterestRateMin?: number;

    @ApiProperty({
        description: '回报利率最大值',
        type: Number,
        required: false
    })
    @IsOptional()
    @IsNumber({}, { message: '回报利率最大值必须是数字' })
    @Min(0, { message: '回报利率最大值不能小于0' })
    @Type(() => Number)
    returnInterestRateMax?: number;

    @ApiProperty({
        description: '还款周期',
        enum: RepaymentPeriodEnum,
        required: false
    })
    @IsOptional()
    @IsEnum(RepaymentPeriodEnum, { message: '还款周期不正确' })
    @Type(() => Number)
    repaymentPeriod?: RepaymentPeriodEnum;

    @ApiProperty({
        description: '还款方式',
        enum: RepaymentMethodEnum,
        required: false
    })
    @IsOptional()
    @IsEnum(RepaymentMethodEnum, { message: '还款方式不正确' })
    @Type(() => Number)
    repaymentMethod?: RepaymentMethodEnum;

    @ApiProperty({
        description: '利率类型',
        enum: InterestTypeEnum,
        required: false
    })
    @IsOptional()
    @IsEnum(InterestTypeEnum, { message: '利率类型不正确' })
    @Type(() => Number)
    interestType?: InterestTypeEnum;

    @ApiProperty({
        description: '是否多次放款',
        type: Boolean,
        required: false
    })
    @IsOptional()
    @IsBoolean({ message: '是否多次放款必须是布尔值' })
    @Type(() => Boolean)
    isMultiple?: boolean;

    @ApiProperty({
        description: '融资期限最小值 (月)',
        type: Number,
        required: false
    })
    @IsOptional()
    @IsNumber({}, { message: '融资期限最小值必须是数字' })
    @Min(1, { message: '融资期限最小值必须大于0' })
    @Type(() => Number)
    finTermMin?: number;

    @ApiProperty({
        description: '融资期限最大值 (月)',
        type: Number,
        required: false
    })
    @IsOptional()
    @IsNumber({}, { message: '融资期限最大值必须是数字' })
    @Min(1, { message: '融资期限最大值必须大于0' })
    @Type(() => Number)
    finTermMax?: number;

    @ApiProperty({
        description: '融资到期日起始日期',
        type: Date,
        required: false,
        example: '2024-01-01'
    })
    @IsOptional()
    @IsDateString({}, { message: '融资到期日起始日期格式不正确' })
    maturityDateStart?: Date;

    @ApiProperty({
        description: '融资到期日结束日期',
        type: Date,
        required: false,
        example: '2024-12-31'
    })
    @IsOptional()
    @IsDateString({}, { message: '融资到期日结束日期格式不正确' })
    maturityDateEnd?: Date;

    @ApiProperty({
        description: '是否公开融资',
        type: Boolean,
        required: false
    })
    @IsOptional()
    @IsBoolean({ message: '是否公开融资必须是布尔值' })
    @Type(() => Boolean)
    isPublic?: boolean;
}