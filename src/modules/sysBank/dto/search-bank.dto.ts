import { Type } from "class-transformer";
import { IsOptional, IsString, Min } from "class-validator";
import { IsNumber } from "class-validator";

export class SearchBankDto {
    /**
     * 当前页码
     */
    @IsNumber()
    @Min(1)
    @Type(() => Number)
    pageNo: number = 1;

    /**
     * 每页数量
     */
    @IsNumber()
    @Min(1)
    @Type(() => Number)
    pageSize: number = 10;

    /**
     * 联行号（等值匹配）
     */
    @IsString()
    @IsOptional()
    code?: string;

    /**
     * 银行名称（全模糊）
     */
    @IsString()
    @IsOptional()
    name?: string;

    /**
     * 省份（等值匹配）
     */
    @IsString()
    @IsOptional()
    province?: string;

    /**
     * 城市（等值匹配）
     */
    @IsString()
    @IsOptional()
    city?: string;

    /**
     * 支行名称（全模糊）
     */
    @IsString()
    @IsOptional()
    branchName?: string;
} 