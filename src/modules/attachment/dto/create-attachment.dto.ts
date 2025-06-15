import { IsOptional, IsString, IsNumber, MaxLength, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAttachmentDto {
    @ApiProperty({
        description: '业务模块名称',
        type: String,
        maxLength: 64,
        required: false
    })
    @IsOptional()
    @IsString({ message: '业务模块名称必须是字符串' })
    @MaxLength(64, { message: '业务模块名称不能超过64个字符' })
    bizModule?: string;

    @ApiProperty({
        description: '业务数据ID',
        type: Number,
        required: false
    })
    @IsOptional()
    @IsNumber({}, { message: '业务数据ID必须是数字' })
    @Min(1, { message: '业务数据ID必须大于0' })
    bizId?: number;

    @ApiProperty({
        description: '原文件名',
        type: String,
        maxLength: 128,
        required: false
    })
    @IsOptional()
    @IsString({ message: '原文件名必须是字符串' })
    @MaxLength(128, { message: '原文件名不能超过128个字符' })
    originalName?: string;

    @ApiProperty({
        description: '存储文件名',
        type: String,
        maxLength: 128,
        required: false
    })
    @IsOptional()
    @IsString({ message: '存储文件名必须是字符串' })
    @MaxLength(128, { message: '存储文件名不能超过128个字符' })
    savedName?: string;

    @ApiProperty({
        description: '文件扩展名',
        type: String,
        maxLength: 32,
        required: false
    })
    @IsOptional()
    @IsString({ message: '文件扩展名必须是字符串' })
    @MaxLength(32, { message: '文件扩展名不能超过32个字符' })
    extension?: string;

    @ApiProperty({
        description: '文件大小(字节)',
        type: Number,
        required: false
    })
    @IsOptional()
    @IsNumber({}, { message: '文件大小必须是数字' })
    @Min(0, { message: '文件大小不能小于0' })
    fileSize?: number;
} 