import { Type } from "class-transformer";
import { IsOptional, IsString, Min } from "class-validator";
import { IsNumber } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class SearchBankDto {
    /**
     * 当前页码
     */
    @ApiProperty({
        description: '当前页码',
        type: Number,
        minimum: 1,
        default: 1
    })
    @IsNumber()
    @Min(1)
    @Type(() => Number)
    pageNo: number = 1;

    /**
     * 每页数量
     */
    @ApiProperty({
        description: '每页显示条数',
        type: Number,
        minimum: 1,
        default: 10
    })
    @IsNumber()
    @Min(1)
    @Type(() => Number)
    pageSize: number = 10;

    /**
     * 联行号（等值匹配）
     */
    @ApiProperty({
        description: '联行号（精确匹配）',
        type: String,
        required: false
    })
    @IsString()
    @IsOptional()
    code?: string;

    /**
     * 银行名称（全模糊）
     */
    @ApiProperty({
        description: '银行名称（模糊查询）',
        type: String,
        required: false
    })
    @IsString()
    @IsOptional()
    name?: string;

    /**
     * 省份（等值匹配）
     */
    @ApiProperty({
        description: '省份（精确匹配）',
        type: String,
        required: false
    })
    @IsString()
    @IsOptional()
    province?: string;

    /**
     * 城市（等值匹配）
     */
    @ApiProperty({
        description: '城市（精确匹配）',
        type: String,
        required: false
    })
    @IsString()
    @IsOptional()
    city?: string;

    /**
     * 支行名称（全模糊）
     */
    @ApiProperty({
        description: '支行名称（模糊查询）',
        type: String,
        required: false
    })
    @IsString()
    @IsOptional()
    branchName?: string;
} 