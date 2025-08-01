import { IsNotEmpty, IsString, IsOptional, IsBoolean, IsNumber, IsArray, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateGuaranteeDto {
    @ApiProperty({
        description: '担保类型',
        type: String,
        maxLength: 64
    })
    @IsOptional()
    @IsString({ message: '担保类型必须是字符串' })
    guaranteeType?: string;

    @ApiProperty({
        description: '是否为信用担保',
        type: Boolean,
        required: false
    })
    @IsOptional()
    @IsBoolean({ message: '是否为信用担保必须是布尔值' })
    isCredit?: boolean;

    @ApiProperty({
        description: '担保费率',
        type: Number,
        required: false
    })
    @IsOptional()
    @IsNumber({}, { message: '担保费率必须是数字' })
    feeRate?: number;

    @ApiProperty({
        description: '保证金 (单位: 万元)',
        type: String,
        required: false,
        example: '10.00'
    })
    @IsOptional()
    @IsString({ message: '保证金必须是字符串' })
    guaranteeBonus?: string;

    @ApiProperty({
        description: '反担保的担保ID',
        type: Number,
        required: false,
        default: 0
    })
    @IsOptional()
    @IsNumber({}, { message: '反担保的担保ID必须是数字' })
    @Min(0, { message: '反担保的担保ID不能小于0' })
    counterGuaranteeId?: number = 0;

    @ApiProperty({
        description: '备注',
        type: String,
        maxLength: 256,
        required: false
    })
    @IsOptional()
    @IsString({ message: '备注必须是字符串' })
    comment?: string;

    @ApiProperty({
        description: '关联的担保物ID列表',
        type: [Number],
        required: false
    })
    @IsOptional()
    @IsArray({ message: '担保物ID列表必须是数组' })
    @IsNumber({}, { each: true, message: '担保物ID必须是数字' })
    @Type(() => Number)
    assetIds?: number[];

    @ApiProperty({
        description: '反担保记录列表',
        type: [CreateGuaranteeDto],
        required: false
    })
    @IsOptional()
    @IsArray({ message: '反担保记录必须是数组' })
    @Type(() => CreateGuaranteeDto)
    counterGuarantees?: CreateGuaranteeDto[];
} 