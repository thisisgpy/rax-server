import { IsNotEmpty, IsString, IsOptional, MaxLength, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateOrgDto {
    @ApiProperty({
        description: '组织ID',
        type: Number
    })
    @IsNotEmpty({ message: '组织ID不能为空' })
    @IsNumber({}, { message: '组织ID必须是数字' })
    @Min(0, { message: '组织ID不能小于0' })
    id: number;

    @ApiProperty({
        description: '组织名称',
        type: String,
        maxLength: 64,
        required: false
    })
    @IsOptional()
    @IsString({ message: '组织名称必须是字符串' })
    @MaxLength(64, { message: '组织名称不能超过64个字符' })
    name?: string;

    @ApiProperty({
        description: '组织简称',
        type: String,
        maxLength: 64,
        required: false
    })
    @IsOptional()
    @IsString({ message: '组织简称必须是字符串' })
    @MaxLength(64, { message: '组织简称不能超过64个字符' })
    nameAbbr?: string;

    @ApiProperty({
        description: '组织备注',
        type: String,
        maxLength: 128,
        required: false
    })
    @IsOptional()
    @IsString({ message: '组织备注必须是字符串' })
    @MaxLength(128, { message: '组织备注不能超过128个字符' })
    comment?: string;

    @ApiProperty({
        description: '父级组织ID',
        type: Number
    })
    @IsNotEmpty({ message: '父级组织ID不能为空' })
    @IsNumber({}, { message: '父级组织ID必须是数字' })
    @Min(0, { message: '父级组织ID不能小于0' })
    parentId: number;
} 