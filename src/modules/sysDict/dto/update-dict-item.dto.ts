import { IsNotEmpty, IsString, IsOptional, IsBoolean, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateDictItemDto {
    @ApiProperty({
        description: '字典项ID',
        type: String
    })
    @IsNotEmpty({ message: 'ID不能为空' })
    @IsString()
    id: string;

    @ApiProperty({
        description: '字典项标签',
        type: String
    })
    @IsNotEmpty({ message: '字典项标签不能为空' })
    @IsString()
    label: string;

    @ApiProperty({
        description: '字典项值',
        type: String
    })
    @IsNotEmpty({ message: '字典项值不能为空' })
    @IsString()
    value: string;

    @ApiProperty({
        description: '字典项备注',
        type: String,
        required: false
    })
    @IsOptional()
    @IsString()
    comment?: string;

    @ApiProperty({
        description: '排序号',
        type: Number,
        minimum: 0,
        required: false
    })
    @IsOptional()
    @IsInt()
    @Min(0)
    sort?: number;

    @ApiProperty({
        description: '父级ID (0表示顶级)',
        type: String,
        required: false
    })
    @IsOptional()
    @IsString()
    parentId?: string;

    @ApiProperty({
        description: '是否启用',
        type: Boolean,
        required: false
    })
    @IsOptional()
    @IsBoolean()
    isEnabled?: boolean;
} 