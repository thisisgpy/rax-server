import { IsNotEmpty, IsNumber, IsArray, ArrayNotEmpty, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignRoleResourceDto {
    @ApiProperty({
        description: '角色ID',
        type: Number
    })
    @IsNotEmpty({ message: '角色ID不能为空' })
    @IsNumber({}, { message: '角色ID必须是数字' })
    @Min(1, { message: '角色ID必须大于0' })
    roleId: number;

    @ApiProperty({
        description: '资源ID列表',
        type: [Number]
    })
    @IsNotEmpty({ message: '资源ID列表不能为空' })
    @IsArray({ message: '资源ID列表必须是数组' })
    @ArrayNotEmpty({ message: '资源ID列表不能为空' })
    @IsNumber({}, { each: true, message: '资源ID必须是数字' })
    resourceIds: number[];
} 