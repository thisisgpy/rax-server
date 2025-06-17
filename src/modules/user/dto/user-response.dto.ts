import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
    @ApiProperty({
        description: '用户ID',
        type: Number
    })
    id: number;

    @ApiProperty({
        description: '组织ID',
        type: Number
    })
    orgId: number;

    @ApiProperty({
        description: '组织名称',
        type: String
    })
    orgName: string;

    @ApiProperty({
        description: '组织简称',
        type: String
    })
    orgNameAbbr: string;

    @ApiProperty({
        description: '手机号',
        type: String
    })
    mobile: string;

    @ApiProperty({
        description: '用户名称',
        type: String
    })
    name: string;

    @ApiProperty({
        description: '性别',
        type: String
    })
    gender: string;

    @ApiProperty({
        description: '身份证号',
        type: String,
        required: false
    })
    idCard?: string;

    @ApiProperty({
        description: '是否已修改了初始密码',
        type: Boolean
    })
    isInitPassword: boolean;

    @ApiProperty({
        description: '状态',
        type: Number
    })
    status: number;

    @ApiProperty({
        description: '是否删除',
        type: Boolean
    })
    isDeleted: boolean;

    @ApiProperty({
        description: '创建时间',
        type: Date
    })
    createTime: Date;

    @ApiProperty({
        description: '创建人',
        type: String
    })
    createBy: string;

    @ApiProperty({
        description: '更新时间',
        type: Date
    })
    updateTime: Date;

    @ApiProperty({
        description: '更新人',
        type: String,
        required: false
    })
    updateBy?: string;
} 