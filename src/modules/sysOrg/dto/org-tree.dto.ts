import { SysOrg } from '../../../entities/sysOrg.entity';
import { ApiProperty } from '@nestjs/swagger';

export class OrgTreeDto {
    @ApiProperty({
        description: '组织ID',
        type: Number
    })
    id: number;

    @ApiProperty({
        description: '组织编码',
        type: String
    })
    code: string;

    @ApiProperty({
        description: '组织名称',
        type: String
    })
    name: string;

    @ApiProperty({
        description: '组织简称',
        type: String
    })
    nameAbbr: string;

    @ApiProperty({
        description: '组织备注',
        type: String,
        required: false
    })
    comment?: string;

    @ApiProperty({
        description: '父级组织ID',
        type: Number
    })
    parentId: number;

    @ApiProperty({
        description: '子组织列表',
        type: [OrgTreeDto],
        required: false,
        isArray: true
    })
    children?: OrgTreeDto[];

    constructor(org: SysOrg) {
        this.id = org.id;
        this.code = org.code;
        this.name = org.name;
        this.nameAbbr = org.nameAbbr;
        this.comment = org.comment;
        this.parentId = org.parentId;
    }
} 