import { ApiProperty } from '@nestjs/swagger';

export class AssetFixedResponseDto {
    @ApiProperty({
        description: '固定资产ID',
        type: Number
    })
    id: number;

    @ApiProperty({
        description: '固定资产名称',
        type: String
    })
    name: string;

    @ApiProperty({
        description: '所属组织ID',
        type: Number
    })
    orgId: number;

    @ApiProperty({
        description: '所属组织名称',
        type: String
    })
    orgName: string;

    @ApiProperty({
        description: '所属组织简称',
        type: String
    })
    orgNameAbbr: string;

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
        type: String
    })
    updateBy: string;
} 