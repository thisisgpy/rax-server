import { IsOptional, IsString, IsNumber, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PageQueryDto } from '../../../common/entities/page.entity';

export class QueryAssetFixedDto extends PageQueryDto {
    @ApiProperty({
        description: '固定资产名称关键字',
        type: String,
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
    orgId?: number;
} 