import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, IsString, Max, Min, Matches } from 'class-validator';

export class SearchFinExistingDto {

  @ApiProperty({
    description: '页码',
    type: Number,
    default: 1,
    minimum: 1
  })
  @IsOptional()
  @IsInt({ message: '页码必须是整数类型' })
  @Min(1, { message: '页码必须大于等于1' })
  pageNo?: number = 1;

  @ApiProperty({
    description: '每页条数',
    type: Number,
    default: 10,
    minimum: 1,
    maximum: 100
  })
  @IsOptional()
  @IsInt({ message: '每页条数必须是整数类型' })
  @Min(1, { message: '每页条数必须大于等于1' })
  @Max(100, { message: '每页条数不能超过100' })
  pageSize?: number = 10;

  @ApiProperty({
    description: '存量融资编码（等值匹配）',
    type: String,
    required: false
  })
  @IsOptional()
  @IsString({ message: '存量融资编码必须是字符串类型' })
  code?: string;

  @ApiProperty({
    description: '融资主体ID（等值匹配）',
    type: String,
    required: false
  })
  @IsOptional()
  @IsString({ message: '融资主体ID必须是字符串类型' })
  orgId?: string;

  @ApiProperty({
    description: '融资名称（模糊匹配）',
    type: String,
    required: false
  })
  @IsOptional()
  @IsString({ message: '融资名称必须是字符串类型' })
  finName?: string;

  @ApiProperty({
    description: '融资结构（等值匹配）',
    type: String,
    required: false
  })
  @IsOptional()
  @IsString({ message: '融资结构必须是字符串类型' })
  fundingStructure?: string;

  @ApiProperty({
    description: '融资方式（等值匹配）',
    type: String,
    required: false
  })
  @IsOptional()
  @IsString({ message: '融资方式必须是字符串类型' })
  fundingMode?: string;

  @ApiProperty({
    description: '金融机构（模糊匹配）',
    type: String,
    required: false
  })
  @IsOptional()
  @IsString({ message: '金融机构必须是字符串类型' })
  financialInstitution?: string;

  @ApiProperty({
    description: '融资总额最小值（万元），支持 6 位小数',
    type: String,
    required: false,
    example: '100.123456'
  })
  @IsOptional()
  @IsString({ message: '融资总额最小值必须是字符串类型' })
  @Matches(/^\d+(\.\d{1,6})?$/, {
    message: '融资总额最小值格式不正确，应为正数且最多支持 6 位小数'
  })
  fundingAmountMin?: string;

  @ApiProperty({
    description: '融资总额最大值（万元），支持 6 位小数',
    type: String,
    required: false,
    example: '1000.123456'
  })
  @IsOptional()
  @IsString({ message: '融资总额最大值必须是字符串类型' })
  @Matches(/^\d+(\.\d{1,6})?$/, {
    message: '融资总额最大值格式不正确，应为正数且最多支持 6 位小数'
  })
  fundingAmountMax?: string;

  @ApiProperty({
    description: '是否为多次放款（等值匹配）',
    type: Boolean,
    required: false
  })
  @IsOptional()
  @IsBoolean({ message: '是否为多次放款必须是布尔类型' })
  isMultiple?: boolean;

  @ApiProperty({
    description: '融资期限最小值（月）',
    type: Number,
    required: false
  })
  @IsOptional()
  @IsInt({ message: '融资期限最小值必须是整数类型' })
  @Min(0, { message: '融资期限最小值必须大于等于0' })
  finTermMin?: number;

  @ApiProperty({
    description: '融资期限最大值（月）',
    type: Number,
    required: false
  })
  @IsOptional()
  @IsInt({ message: '融资期限最大值必须是整数类型' })
  @Min(0, { message: '融资期限最大值必须大于等于0' })
  finTermMax?: number;

  @ApiProperty({
    description: '是否为公开融资（等值匹配）',
    type: Boolean,
    required: false
  })
  @IsOptional()
  @IsBoolean({ message: '是否为公开融资必须是布尔类型' })
  isPublic?: boolean;

  @ApiProperty({
    description: '还款周期（等值匹配）',
    type: Number,
    required: false
  })
  @IsOptional()
  @IsInt({ message: '还款周期必须是整数类型' })
  repaymentPeriod?: number;

  @ApiProperty({
    description: '还款方式（等值匹配）',
    type: Number,
    required: false
  })
  @IsOptional()
  @IsInt({ message: '还款方式必须是整数类型' })
  repaymentMethod?: number;

  @ApiProperty({
    description: '利息类型（等值匹配）',
    type: Number,
    required: false
  })
  @IsOptional()
  @IsInt({ message: '利息类型必须是整数类型' })
  interestType?: number;
} 