import { IsNotEmpty, IsString, IsNumber, IsOptional, MaxLength, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAssetFixedDto {
    @ApiProperty({
        description: '固定资产名称',
        type: String,
        maxLength: 128
    })
    @IsNotEmpty({ message: '固定资产名称不能为空' })
    @IsString({ message: '固定资产名称必须是字符串' })
    @MaxLength(128, { message: '固定资产名称不能超过128个字符' })
    name: string;

    @ApiProperty({
        description: '所属组织ID',
        type: Number
    })
    @IsNotEmpty({ message: '所属组织ID不能为空' })
    @IsNumber({}, { message: '所属组织ID必须是数字' })
    @Min(1, { message: '所属组织ID必须大于0' })
    orgId: number;
} 