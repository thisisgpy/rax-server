import { IsString, IsBoolean, IsOptional, IsNotEmpty, MaxLength } from 'class-validator';

export class UpdateDictDto {
    @IsString({ message: '字典ID必须是字符串' })
    @IsNotEmpty({ message: '字典ID不能为空' })
    id: string;

    @IsString({ message: '字典名称必须是字符串' })
    @IsNotEmpty({ message: '字典名称不能为空' })
    @MaxLength(64, { message: '字典名称不能超过64个字符' })
    name: string;

    @IsString({ message: '字典备注必须是字符串' })
    @IsOptional()
    @MaxLength(128, { message: '字典备注不能超过128个字符' })
    comment?: string;

    @IsBoolean({ message: '是否启用必须是布尔值' })
    @IsNotEmpty({ message: '是否启用不能为空' })
    isEnabled: boolean;
} 