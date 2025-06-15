import { IsNotEmpty, IsString, IsNumber, MaxLength, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class UploadFileDto {
    @ApiProperty({
        description: '业务模块名称',
        type: String,
        maxLength: 64,
        example: 'asset_fixed'
    })
    @IsNotEmpty({ message: '业务模块名称不能为空' })
    @IsString({ message: '业务模块名称必须是字符串' })
    @MaxLength(64, { message: '业务模块名称不能超过64个字符' })
    bizModule: string;

    @ApiProperty({
        description: '业务数据ID',
        type: Number,
        example: 123
    })
    @IsNotEmpty({ message: '业务数据ID不能为空' })
    @Transform(({ value }) => parseInt(value))
    @IsNumber({}, { message: '业务数据ID必须是数字' })
    @Min(1, { message: '业务数据ID必须大于0' })
    bizId: number;
} 