import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNotEmpty, IsNumber, IsString, Matches, Min } from 'class-validator';

export class CreateFinExistingDto {

  @ApiProperty({ description: '储备融资 ID. 0 表示非储备融资转入' })
  @IsString({ message: '储备融资ID必须是字符串类型' })
  @IsNotEmpty({ message: '储备融资ID不能为空' })
  reserveId: string;

  @ApiProperty({ description: '融资主体 ID' })
  @IsString({ message: '融资主体ID必须是字符串类型' })
  @IsNotEmpty({ message: '融资主体ID不能为空' })
  orgId: string;

  @ApiProperty({ description: '融资主体编码' })
  @IsString({ message: '融资主体编码必须是字符串类型' })
  @IsNotEmpty({ message: '融资主体编码不能为空' })
  orgCode: string;

  @ApiProperty({ description: '融资名称' })
  @IsString({ message: '融资名称必须是字符串类型' })
  @IsNotEmpty({ message: '融资名称不能为空' })
  finName: string;

  @ApiProperty({ description: '融资结构' })
  @IsString({ message: '融资结构必须是字符串类型' })
  @IsNotEmpty({ message: '融资结构不能为空' })
  fundingStructure: string;

  @ApiProperty({ description: '融资方式' })
  @IsString({ message: '融资方式必须是字符串类型' })
  @IsNotEmpty({ message: '融资方式不能为空' })
  fundingMode: string;

  @ApiProperty({ description: '金融机构' })
  @IsString({ message: '金融机构必须是字符串类型' })
  @IsNotEmpty({ message: '金融机构不能为空' })
  financialInstitution: string;

  @ApiProperty({ 
    description: '融资总额，以万元为单位，支持 6 位小数',
    example: '1234.567890'
  })
  @IsString({ message: '融资总额必须是字符串类型' })
  @IsNotEmpty({ message: '融资总额不能为空' })
  @Matches(/^\d+(\.\d{1,6})?$/, {
    message: '融资总额格式不正确，应为正数且最多支持 6 位小数'
  })
  fundingAmount: string;

  @ApiProperty({ 
    description: '回报利率，支持 4 位小数',
    example: 1234.5678
  })
  @IsNumber({ maxDecimalPlaces: 4 }, { message: '回报利率必须是数字类型，最多支持 4 位小数' })
  returnInterestRate: number;

  @ApiProperty({ description: '还款周期', required: true})
  @IsInt({ message: '还款周期必须是整数类型' })
  @IsNotEmpty({ message: '还款周期不能为空' })
  repaymentPeriod: number;

  @ApiProperty({ description: '还款方式', required: true})
  @IsInt({ message: '还款方式必须是整数类型' })
  @IsNotEmpty({ message: '还款方式不能为空' })
  repaymentMethod: number;

  @ApiProperty({ description: '利息类型', required: true})
  @IsInt({ message: '利息类型必须是整数类型' })
  @IsNotEmpty({ message: '利息类型不能为空' })
  interestType: number;

  @ApiProperty({ 
    description: '基准利率，支持 4 位小数',
    example: 1234.5678
  })
  @IsNumber({ maxDecimalPlaces: 4 }, { message: '基准利率必须是数字类型，最多支持 4 位小数' })
  loanPrimeRate: number;

  @ApiProperty({ 
    description: '基点，支持 4 位小数',
    example: 1234.5678
  })
  @IsNumber({ maxDecimalPlaces: 4 }, { message: '基点必须是数字类型，最多支持 4 位小数' })
  basisPoint: number;

  @ApiProperty({ description: '计息基准', required: true})
  @IsInt({ message: '计息基准必须是整数类型' })
  @IsNotEmpty({ message: '计息基准不能为空' })
  daysCountBasis: number;

  @ApiProperty({ description: '结息日当日是否计息', default: true })
  @IsBoolean({ message: '结息日当日是否计息必须是布尔类型' })
  @IsNotEmpty({ message: '结息日当日是否计息不能为空' })
  includeSettlementDate: boolean;

  @ApiProperty({ description: '还款日相对于结息日的延迟天数', default: 0 })
  @IsInt({ message: '还款延迟天数必须是整数类型' })
  @IsNotEmpty({ message: '还款延迟天数不能为空' })
  repaymentDelayDays: number;

  @ApiProperty({ description: '续贷来源 ID.0 表示非续贷' })
  @IsString({ message: '续贷来源ID必须是字符串类型' })
  @IsNotEmpty({ message: '续贷来源ID不能为空' })
  loanRenewalFromId: string;

  @ApiProperty({ description: '是否为多次放款', default: true })
  @IsBoolean({ message: '是否为多次放款必须是布尔类型' })
  @IsNotEmpty({ message: '是否为多次放款不能为空' })
  isMultiple: boolean;

  @ApiProperty({ description: '融资期限，以月为单位' })
  @IsInt({ message: '融资期限必须是整数类型' })
  @IsNotEmpty({ message: '融资期限不能为空' })
  @Min(1, { message: '融资期限必须大于等于1个月' })
  finTerm: number;

  @ApiProperty({ description: '是否为公开融资', default: true })
  @IsBoolean({ message: '是否为公开融资必须是布尔类型' })
  @IsNotEmpty({ message: '是否为公开融资不能为空' })
  isPublic: boolean;
} 