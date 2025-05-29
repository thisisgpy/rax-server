import { Type } from 'class-transformer';
import { IsString, IsNumber, IsDate, IsArray, ValidateNested, IsOptional, IsNotEmpty, ArrayMinSize } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReserveCostDetailDto {
  @ApiProperty({
    description: '成本类型 (例如: 利息、手续费、担保费等)',
    type: String
  })
  @IsString()
  @IsNotEmpty({ message: '成本类型不能为空' })
  costType: string;

  @ApiProperty({
    description: '成本详情. 可能是数字、百分比、文字',
    type: String
  })
  @IsString()
  @IsNotEmpty({ message: '成本详情不能为空' })
  costAmount: string;
}

export class CreateReserveProgressDto {
  @ApiProperty({
    description: '进度名称 (例如: 材料准备、银行审核、放款等)',
    type: String
  })
  @IsString()
  @IsNotEmpty({ message: '进度名称不能为空' })
  progressName: string;

  @ApiProperty({
    description: '计划完成日期',
    type: Date
  })
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty({ message: '计划日期不能为空' })
  planDate: Date;
}

export class CreateReserveDto {
  @ApiProperty({
    description: '融资主体组织ID',
    type: String
  })
  @IsString()
  @IsNotEmpty({ message: '组织ID不能为空' })
  orgId: string;

  @ApiProperty({
    description: '金融机构名称',
    type: String
  })
  @IsString()
  @IsNotEmpty({ message: '金融机构不能为空' })
  financialInstitution: string;

  @ApiProperty({
    description: '融资方式 (例如: 信用贷款、抵押贷款等)',
    type: String
  })
  @IsString()
  @IsNotEmpty({ message: '融资方式不能为空' })
  fundingMode: string;

  @ApiProperty({
    description: '融资金额 (单位: 万元)',
    type: Number
  })
  @IsNumber({ maxDecimalPlaces: 6 }, {
    message: '融资金额格式不正确，最多支持 6 位小数'
  })
  @IsNotEmpty({ message: '融资金额不能为空' })
  fundingAmount: number;

  @ApiProperty({
    description: '预计放款日期',
    type: Date
  })
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty({ message: '预计放款日期不能为空' })
  expectedDisbursementDate: Date;

  @ApiProperty({
    description: '续贷来源ID (0表示新增融资)',
    type: String,
    required: false,
    default: '0'
  })
  @IsString()
  @IsOptional()
  loanRenewalFromId: string = '0';

  @ApiProperty({
    description: '负责人姓名',
    type: String
  })
  @IsString()
  @IsNotEmpty({ message: '负责人姓名不能为空' })
  leaderName: string;

  @ApiProperty({
    description: '负责人ID',
    type: String
  })
  @IsString()
  @IsNotEmpty({ message: '负责人ID不能为空' })
  leaderId: string;

  @ApiProperty({
    description: '执行人姓名',
    type: String
  })
  @IsString()
  @IsNotEmpty({ message: '执行人姓名不能为空' })
  executorName: string;

  @ApiProperty({
    description: '执行人ID',
    type: String
  })
  @IsString()
  @IsNotEmpty({ message: '执行人ID不能为空' })
  executorId: string;

  @ApiProperty({
    description: '综合成本率 (单位: %)',
    type: Number
  })
  @IsNumber({ maxDecimalPlaces: 6 }, {
    message: '综合成本率格式不正确，最多支持 6 位小数'
  })
  combinedRatio: number;

  @ApiProperty({
    description: '附加费用 (单位: 万元)',
    type: Number
  })
  @IsNumber({ maxDecimalPlaces: 6 }, {
    message: '附加费用格式不正确，最多支持 6 位小数'
  })
  additionalCosts: number;

  @ApiProperty({
    description: '成本明细列表',
    type: [CreateReserveCostDetailDto],
    isArray: true,
    minItems: 1
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateReserveCostDetailDto)
  @ArrayMinSize(1)
  costDetails: CreateReserveCostDetailDto[];

  @ApiProperty({
    description: '进度计划列表',
    type: [CreateReserveProgressDto],
    isArray: true,
    minItems: 1
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateReserveProgressDto)
  @ArrayMinSize(1)
  progressList: CreateReserveProgressDto[];
} 