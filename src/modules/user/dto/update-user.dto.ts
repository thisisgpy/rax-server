import { IsNotEmpty, IsString, IsOptional, IsNumber, IsEnum, MinLength, MaxLength, IsPhoneNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
    @ApiProperty({
        description: '用户ID',
        type: Number
    })
    @IsNotEmpty({ message: '用户ID不能为空' })
    @IsNumber({}, { message: '用户ID必须是数字' })
    @Min(1, { message: '用户ID必须大于0' })
    id: number;

    @ApiProperty({
        description: '组织ID',
        type: Number,
        required: false
    })
    @IsOptional()
    @IsNumber({}, { message: '组织ID必须是数字' })
    @Min(1, { message: '组织ID必须大于0' })
    orgId?: number;

    @ApiProperty({
        description: '手机号',
        type: String,
        maxLength: 11,
        required: false
    })
    @IsOptional()
    @IsString({ message: '手机号必须是字符串' })
    @IsPhoneNumber('CN', { message: '手机号格式不正确' })
    mobile?: string;

    @ApiProperty({
        description: '用户名称',
        type: String,
        maxLength: 64,
        required: false
    })
    @IsOptional()
    @IsString({ message: '用户名称必须是字符串' })
    @MaxLength(64, { message: '用户名称不能超过64个字符' })
    name?: string;

    @ApiProperty({
        description: '性别',
        type: String,
        enum: ['男', '女'],
        required: false
    })
    @IsOptional()
    gender?: string;

    @ApiProperty({
        description: '身份证号',
        type: String,
        maxLength: 18,
        required: false
    })
    @IsOptional()
    @IsString({ message: '身份证号必须是字符串' })
    @MaxLength(18, { message: '身份证号不能超过18个字符' })
    idCard?: string;

    @ApiProperty({
        description: '状态',
        type: Number,
        enum: [0, 1],
        required: false
    })
    @IsOptional()
    @IsNumber({}, { message: '状态必须是数字' })
    status?: number;
} 