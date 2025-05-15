import { IsNotEmpty, IsString, IsOptional, MaxLength, Matches } from 'class-validator';

export class CreateOrgDto {
    @IsNotEmpty({ message: '组织名称不能为空' })
    @IsString({ message: '组织名称必须是字符串' })
    @MaxLength(64, { message: '组织名称不能超过64个字符' })
    name: string;

    @IsNotEmpty({ message: '组织简称不能为空' })
    @IsString({ message: '组织简称必须是字符串' })
    @MaxLength(64, { message: '组织简称不能超过64个字符' })
    nameAbbr: string;

    @IsOptional()
    @IsString({ message: '组织备注必须是字符串' })
    @MaxLength(128, { message: '组织备注不能超过128个字符' })
    comment?: string;

    @IsNotEmpty({ message: '父级组织ID不能为空' })
    @IsString({ message: '父级组织ID必须是字符串' })
    @Matches(/^[0-9]+$/, { message: '父级组织ID必须是数字字符串' })
    parentId: string;
} 