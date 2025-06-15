import { IsNotEmpty, IsString, IsNumber, IsOptional, MaxLength, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAssetFixedDto {
    @ApiProperty({
        description: '固定资产ID',
        type: Number
    })
    @IsNotEmpty({ message: '固定资产ID不能为空' })
    @IsNumber({}, { message: '固定资产ID必须是数字' })
    @Min(1, { message: '固定资产ID必须大于0' })
    id: number;

    @ApiProperty({
        description: '固定资产名称',
        type: String,
        maxLength: 128,
        required: false
    })
    @IsOptional()
    @IsString({ message: '固定资产名称必须是字符串' })
    @MaxLength(128, { message: '固定资产名称不能超过128个字符' })
    name?: string;

    @ApiProperty({
        description: '所属组织ID',
        type: Number,
        required: false
    })
    @IsOptional()
    @IsNumber({}, { message: '所属组织ID必须是数字' })
    @Min(1, { message: '所属组织ID必须大于0' })
    orgId?: number;
} 