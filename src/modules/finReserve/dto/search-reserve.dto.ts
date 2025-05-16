import { IsOptional, IsString, IsEnum, IsInt, Min } from 'class-validator';
import { FinReserveStatus } from '../../../entities/finReserve.entity';
import { ApiProperty } from '@nestjs/swagger';

export class SearchReserveDto {
  @ApiProperty({
    description: '当前页码',
    type: Number,
    minimum: 1,
    default: 1
  })
  @IsInt()
  @Min(1)
  pageNo: number = 1;

  @ApiProperty({
    description: '每页显示条数',
    type: Number,
    minimum: 1,
    default: 10
  })
  @IsInt()
  @Min(1)
  pageSize: number = 10;

  @ApiProperty({
    description: '融资主体组织ID，用于筛选特定组织的储备融资记录',
    type: String,
    required: false
  })
  @IsString()
  @IsOptional()
  orgId?: string;

  @ApiProperty({
    description: '金融机构名称，用于筛选特定金融机构的储备融资记录',
    type: String,
    required: false
  })
  @IsString()
  @IsOptional()
  financialInstitution?: string;

  @ApiProperty({
    description: '融资方式 (例如: 信用贷款、抵押贷款等)',
    type: String,
    required: false
  })
  @IsString()
  @IsOptional()
  fundingMode?: string;

  @ApiProperty({
    description: '储备融资状态',
    enum: FinReserveStatus,
    enumName: 'FinReserveStatus',
    required: false
  })
  @IsEnum(FinReserveStatus)
  @IsOptional()
  status?: FinReserveStatus;

  @ApiProperty({
    description: '负责人ID，用于筛选特定负责人的储备融资记录',
    type: String,
    required: false
  })
  @IsString()
  @IsOptional()
  leaderId?: string;

  @ApiProperty({
    description: '执行人ID，用于筛选特定执行人的储备融资记录',
    type: String,
    required: false
  })
  @IsString()
  @IsOptional()
  executorId?: string;
} 