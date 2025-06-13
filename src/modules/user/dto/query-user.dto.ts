import { IsOptional, IsString, IsNumber, IsEnum, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PageQueryDto } from '../../../common/entities/page.entity';

export class QueryUserDto extends PageQueryDto {
    @ApiProperty({
        description: '组织ID',
        type: Number,
        required: false
    })
    @IsOptional()
    @IsNumber({}, { message: '组织ID必须是数字' })
    orgId?: number;

    @ApiProperty({
        description: '手机号',
        type: String,
        required: false
    })
    @IsOptional()
    @IsString({ message: '手机号必须是字符串' })
    mobile?: string;

    @ApiProperty({
        description: '用户名称',
        type: String,
        required: false
    })
    @IsOptional()
    @IsString({ message: '用户名称必须是字符串' })
    @MaxLength(64, { message: '用户名称不能超过64个字符' })
    name?: string;

    @ApiProperty({
        description: '状态',
        type: Number,
        enum: [0, 1],
        required: false
    })
    @IsOptional()
    @IsNumber({}, { message: '状态必须是数字' })
    @IsEnum([0, 1], { message: '状态只能是0(禁用)或1(启用)' })
    status?: number;
} 