import { IsNotEmpty, IsString, IsOptional, IsBoolean, IsInt, Min, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDictItemDto {
    @ApiProperty({
        description: '字典ID',
        type: Number
    })
    @IsNotEmpty({ message: '字典ID不能为空' })
    @IsNumber({}, { message: '字典ID必须是数字' })
    @Min(0, { message: '字典ID不能小于0' })
    dictId: number;

    @ApiProperty({
        description: '字典编码',
        type: String
    })
    @IsNotEmpty({ message: '字典编码不能为空' })
    @IsString()
    dictCode: string;

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
        type: Number,
        required: false,
        default: 0
    })
    @IsOptional()
    @IsNumber({}, { message: '父级ID必须是数字' })
    @Min(0, { message: '父级ID不能小于0' })
    parentId?: number = 0;

    @ApiProperty({
        description: '是否启用',
        type: Boolean,
        required: false,
        default: true
    })
    @IsOptional()
    @IsBoolean()
    isEnabled?: boolean = true;
} 