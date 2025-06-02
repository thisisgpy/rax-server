import { IsNotEmpty, IsString, IsOptional, IsBoolean, IsInt, Min, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateDictItemDto {
    @ApiProperty({
        description: '字典项ID',
        type: Number
    })
    @IsNotEmpty({ message: 'ID不能为空' })
    @IsNumber({}, { message: 'ID必须是数字' })
    @Min(0, { message: 'ID不能小于0' })
    id: number;

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
        required: false
    })
    @IsOptional()
    @IsNumber({}, { message: '父级ID必须是数字' })
    @Min(0, { message: '父级ID不能小于0' })
    parentId?: number = 0;

    @ApiProperty({
        description: '是否启用',
        type: Boolean,
        required: false
    })
    @IsOptional()
    @IsBoolean()
    isEnabled?: boolean = true;
} 