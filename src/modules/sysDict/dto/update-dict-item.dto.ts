import { IsNotEmpty, IsString, IsOptional, IsBoolean, IsInt, Min } from 'class-validator';

export class UpdateDictItemDto {
    @IsNotEmpty({ message: 'ID不能为空' })
    @IsString()
    id: string;

    @IsNotEmpty({ message: '字典项标签不能为空' })
    @IsString()
    label: string;

    @IsNotEmpty({ message: '字典项值不能为空' })
    @IsString()
    value: string;

    @IsOptional()
    @IsString()
    comment?: string;

    @IsOptional()
    @IsInt()
    @Min(0)
    sort?: number;

    @IsOptional()
    @IsString()
    parentId?: string;

    @IsOptional()
    @IsBoolean()
    isEnabled?: boolean;
} 