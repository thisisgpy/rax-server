import { IsNotEmpty, IsString, IsOptional, IsBoolean, IsInt, Min } from 'class-validator';

export class CreateDictItemDto {
    @IsNotEmpty({ message: '字典ID不能为空' })
    @IsString()
    dictId: string;

    @IsNotEmpty({ message: '字典编码不能为空' })
    @IsString()
    dictCode: string;

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
    parentId?: string = '0';

    @IsOptional()
    @IsBoolean()
    isEnabled?: boolean = true;
} 