import { Type } from 'class-transformer';
import { IsString, IsNumber, IsDate, IsArray, ValidateNested, IsOptional, Min, IsNotEmpty, ArrayMinSize } from 'class-validator';

export class CreateReserveCostDetailDto {
  @IsString()
  @IsNotEmpty({ message: '成本类型不能为空' })
  costType: string;

  @IsString()
  @IsNotEmpty({ message: '成本金额不能为空' })
  costAmount: string;
}

export class CreateReserveProgressDto {
  @IsString()
  @IsNotEmpty({ message: '进度名称不能为空' })
  progressName: string;

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty({ message: '计划日期不能为空' })
  planDate: Date;
}

export class CreateReserveDto {
  @IsString()
  @IsNotEmpty({ message: '组织ID不能为空' })
  orgId: string;

  @IsString()
  @IsNotEmpty({ message: '金融机构不能为空' })
  financialInstitution: string;

  @IsString()
  @IsNotEmpty({ message: '融资方式不能为空' })
  fundingMode: string;

  @IsNumber()
  @Min(0)
  @IsNotEmpty({ message: '融资金额不能为空' })
  fundingAmount: number;

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty({ message: '预计放款日期不能为空' })
  expectedDisbursementDate: Date;

  @IsString()
  @IsOptional()
  loanRenewalFromId: string = '0';

  @IsString()
  @IsNotEmpty({ message: '负责人姓名不能为空' })
  leaderName: string;

  @IsString()
  @IsNotEmpty({ message: '负责人ID不能为空' })
  leaderId: string;

  @IsString()
  @IsNotEmpty({ message: '执行人姓名不能为空' })
  executorName: string;

  @IsString()
  @IsNotEmpty({ message: '执行人ID不能为空' })
  executorId: string;

  @IsNumber()
  @Min(0)
  combinedRatio: number;

  @IsNumber()
  @Min(0)
  additionalCosts: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateReserveCostDetailDto)
  @ArrayMinSize(1)
  costDetails: CreateReserveCostDetailDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateReserveProgressDto)
  @ArrayMinSize(1)
  progressList: CreateReserveProgressDto[];
} 