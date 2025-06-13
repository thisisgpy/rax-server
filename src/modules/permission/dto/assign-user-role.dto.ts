import { IsNotEmpty, IsNumber, IsArray, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignUserRoleDto {
    @ApiProperty({
        description: '用户ID',
        type: Number
    })
    @IsNotEmpty({ message: '用户ID不能为空' })
    @IsNumber({}, { message: '用户ID必须是数字' })
    @Min(1, { message: '用户ID必须大于0' })
    userId: number;

    @ApiProperty({
        description: '角色ID列表',
        type: [Number]
    })
    @IsArray({ message: '角色ID列表必须是数组' })
    roleIds: number[];
} 