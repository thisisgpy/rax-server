import { IsNotEmpty, IsString, IsOptional, MaxLength, Min, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateRoleDto {

    @ApiProperty({
        description: '角色ID',
        type: Number
    })
    @IsNotEmpty({ message: '角色ID不能为空' })
    @IsNumber({}, { message: '角色ID必须是数字' })
    @Min(1, { message: '用户ID必须大于0' })
    id: number;

    @ApiProperty({
        description: '角色编码',
        type: String,
        maxLength: 64
    })
    @IsNotEmpty({ message: '角色编码不能为空' })
    @IsString({ message: '角色编码必须是字符串' })
    @MaxLength(64, { message: '角色编码不能超过64个字符' })
    code: string;

    @ApiProperty({
        description: '角色名称',
        type: String,
        maxLength: 64
    })
    @IsNotEmpty({ message: '角色名称不能为空' })
    @IsString({ message: '角色名称必须是字符串' })
    @MaxLength(64, { message: '角色名称不能超过64个字符' })
    name: string;

    @ApiProperty({
        description: '角色备注',
        type: String,
        maxLength: 128,
        required: false
    })
    @IsOptional()
    @IsString({ message: '角色备注必须是字符串' })
    @MaxLength(128, { message: '角色备注不能超过128个字符' })
    comment?: string;
} 