import { IsString, IsBoolean, IsOptional, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class QueryDictDto {
    @ApiProperty({
        description: '当前页码',
        type: Number,
        minimum: 1
    })
    @IsNumber()
    @Min(1)
    @Type(() => Number)
    pageNo: number;

    @ApiProperty({
        description: '每页显示条数',
        type: Number,
        minimum: 1
    })
    @IsNumber()
    @Min(1)
    @Type(() => Number)
    pageSize: number;

    @ApiProperty({
        description: '字典编码（模糊查询）',
        type: String,
        required: false
    })
    @IsString()
    @IsOptional()
    code?: string;

    @ApiProperty({
        description: '字典名称（模糊查询）',
        type: String,
        required: false
    })
    @IsString()
    @IsOptional()
    name?: string;

    @ApiProperty({
        description: '是否启用',
        type: Boolean,
        required: false
    })
    @IsBoolean()
    @IsOptional()
    @Type(() => Boolean)
    isEnabled?: boolean;
} 