import { IsString, IsBoolean, IsOptional, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryDictDto {
    @IsNumber()
    @Min(1)
    @Type(() => Number)
    pageNo: number;

    @IsNumber()
    @Min(1)
    @Type(() => Number)
    pageSize: number;

    @IsString()
    @IsOptional()
    code?: string;

    @IsString()
    @IsOptional()
    name?: string;

    @IsBoolean()
    @IsOptional()
    @Type(() => Boolean)
    isEnabled?: boolean;
} 