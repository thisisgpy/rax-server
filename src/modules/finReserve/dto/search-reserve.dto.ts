import { IsOptional, IsString, IsEnum, IsInt, Min } from 'class-validator';
import { FinReserveStatus } from '../../../entities/finReserve.entity';

export class SearchReserveDto {
  @IsInt()
  @Min(1)
  pageNo: number = 1;

  @IsInt()
  @Min(1)
  pageSize: number = 10;

  @IsString()
  @IsOptional()
  orgId?: string;

  @IsString()
  @IsOptional()
  financialInstitution?: string;

  @IsString()
  @IsOptional()
  fundingMode?: string;

  @IsEnum(FinReserveStatus)
  @IsOptional()
  status?: FinReserveStatus;

  @IsString()
  @IsOptional()
  leaderId?: string;

  @IsString()
  @IsOptional()
  executorId?: string;
} 