import { IsString, IsBoolean, IsOptional, IsNotEmpty, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDictDto {
    @ApiProperty({
        description: '字典编码',
        type: String,
        maxLength: 64
    })
    @IsString({ message: '字典编码必须是字符串' })
    @IsNotEmpty({ message: '字典编码不能为空' })
    @MaxLength(64, { message: '字典编码不能超过64个字符' })
    code: string;

    @ApiProperty({
        description: '字典名称',
        type: String,
        maxLength: 64
    })
    @IsString({ message: '字典名称必须是字符串' })
    @IsNotEmpty({ message: '字典名称不能为空' })
    @MaxLength(64, { message: '字典名称不能超过64个字符' })
    name: string;

    @ApiProperty({
        description: '字典备注',
        type: String,
        maxLength: 128,
        required: false
    })
    @IsString({ message: '字典备注必须是字符串' })
    @IsOptional()
    @MaxLength(128, { message: '字典备注不能超过128个字符' })
    comment?: string;

    @ApiProperty({
        description: '是否启用',
        type: Boolean
    })
    @IsBoolean({ message: '是否启用必须是布尔值' })
    @IsNotEmpty({ message: '是否启用不能为空' })
    isEnabled: boolean;
} 