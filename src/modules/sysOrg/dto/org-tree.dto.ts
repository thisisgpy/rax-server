import { SysOrg } from '../../../entities/sysOrg.entity';

export class OrgTreeDto {
    id: string;
    code: string;
    name: string;
    nameAbbr: string;
    comment?: string;
    parentId: string;
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