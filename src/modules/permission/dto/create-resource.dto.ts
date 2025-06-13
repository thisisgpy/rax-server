import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsOptional, IsBoolean, Min } from 'class-validator';

export class CreateResourceDto {
    @ApiProperty({ description: '资源编码' })
    @IsNotEmpty({ message: '资源编码不能为空' })
    @IsString({ message: '资源编码必须是字符串' })
    code: string;

    @ApiProperty({ description: '资源名称' })
    @IsNotEmpty({ message: '资源名称不能为空' })
    @IsString({ message: '资源名称必须是字符串' })
    name: string;

    @ApiProperty({ description: '资源类型. 0:目录, 1:菜单, 2:按钮' })
    @IsNotEmpty({ message: '资源类型不能为空' })
    @IsNumber({}, { message: '资源类型必须是数字' })
    @Min(0, { message: '资源类型最小值为0' })
    type: number;

    @ApiProperty({ description: '父级资源ID. 0表示没有父级资源', required: false })
    @IsOptional()
    @IsNumber({}, { message: '父级资源ID必须是数字' })
    parentId?: number;

    @ApiProperty({ description: '资源路径', required: false })
    @IsOptional()
    @IsString({ message: '资源路径必须是字符串' })
    path?: string;

    @ApiProperty({ description: '资源组件', required: false })
    @IsOptional()
    @IsString({ message: '资源组件必须是字符串' })
    component?: string;

    @ApiProperty({ description: '资源图标', required: false })
    @IsOptional()
    @IsString({ message: '资源图标必须是字符串' })
    icon?: string;

    @ApiProperty({ description: '资源排序', required: false })
    @IsOptional()
    @IsNumber({}, { message: '资源排序必须是数字' })
    sort?: number;

    @ApiProperty({ description: '是否隐藏. 0:否, 1:是', required: false})
    @IsOptional()
    @IsBoolean({ message: '是否隐藏必须是布尔值' })
    isHidden?: boolean;

    @ApiProperty({ description: '是否缓存. 0:否, 1:是', required: false })
    @IsOptional()
    @IsBoolean({ message: '是否缓存必须是布尔值' })
    isKeepAlive?: boolean;

    @ApiProperty({ description: '是否外部链接. 0:否, 1:是', required: false })
    @IsOptional()
    @IsBoolean({ message: '是否外部链接必须是布尔值' })
    isExternalLink?: boolean;
} 