import { IsNotEmpty, IsString, IsOptional, IsNumber, IsEnum, IsBoolean, MinLength, MaxLength, IsPhoneNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty({
        description: '组织ID',
        type: Number
    })
    @IsNotEmpty({ message: '组织ID不能为空' })
    @IsNumber({}, { message: '组织ID必须是数字' })
    @Min(1, { message: '组织ID必须大于0' })
    orgId: number;

    @ApiProperty({
        description: '手机号',
        type: String,
        maxLength: 11
    })
    @IsNotEmpty({ message: '手机号不能为空' })
    @IsString({ message: '手机号必须是字符串' })
    @IsPhoneNumber('CN', { message: '手机号格式不正确' })
    mobile: string;

    @ApiProperty({
        description: '用户名称',
        type: String,
        maxLength: 64
    })
    @IsNotEmpty({ message: '用户名称不能为空' })
    @IsString({ message: '用户名称必须是字符串' })
    @MaxLength(64, { message: '用户名称不能超过64个字符' })
    name: string;

    @ApiProperty({
        description: '性别',
        type: String,
    })
    @IsNotEmpty({message: '性别不能为空'})
    @IsString({message: "性别必须是字符串"})
    gender: string;

    @ApiProperty({
        description: '身份证号',
        type: String,
        maxLength: 18,
    })
    @IsNotEmpty({ message: '身份证号不能为空' })
    @IsString({ message: '身份证号必须是字符串' })
    @MaxLength(18, { message: '身份证号不能超过18个字符' })
    idCard: string;

    @ApiProperty({
        description: '密码',
        type: String,
        minLength: 6,
        maxLength: 32
    })
    @IsNotEmpty({ message: '密码不能为空' })
    @IsString({ message: '密码必须是字符串' })
    @MinLength(6, { message: '密码至少6个字符' })
    @MaxLength(32, { message: '密码不能超过20个字符' })
    password: string;

    @ApiProperty({
        description: '状态',
        type: Number,
        enum: [0, 1],
        default: 1
    })
    @IsOptional()
    @IsNumber({}, { message: '状态必须是数字' })
    status?: number = 1;
} 