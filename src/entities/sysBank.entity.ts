import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('sys_bank')
export class SysBank {
    @PrimaryColumn({ name: 'code', comment: '联行号' })
    code: string;

    @Column({ name: 'name', comment: '银行名称' })
    name: string;

    @Column({ name: 'name_abbr', comment: '银行名称简称' })
    nameAbbr: string;

    @Column({ name: 'province', comment: '省份' })
    province: string;

    @Column({ name: 'city', comment: '城市' })
    city: string;

    @Column({ name: 'branch_name', comment: '支行名称' })
    branchName: string;
} 