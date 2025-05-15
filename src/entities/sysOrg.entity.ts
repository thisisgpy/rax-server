import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('sys_org')
export class SysOrg {
    @PrimaryColumn({
        name: 'id',
        type: 'varchar',
        length: 64,
        comment: '组织ID'
    })
    id: string;

    @Column({
        name: 'code',
        type: 'varchar',
        length: 64,
        comment: '组织编码. 4位一级. 0001,00010001,000100010001,以此类推'
    })
    code: string;

    @Column({
        name: 'name',
        type: 'varchar',
        length: 64,
        comment: '组织名称'
    })
    name: string;

    @Column({
        name: 'name_abbr',
        type: 'varchar',
        length: 64,
        comment: '组织名称简称'
    })
    nameAbbr: string;

    @Column({
        name: 'comment',
        type: 'varchar',
        length: 128,
        nullable: true,
        comment: '组织备注'
    })
    comment: string;

    @Column({
        name: 'parent_id',
        type: 'varchar',
        length: 64,
        default: '0',
        comment: '父级组织ID. 0表示没有父组织'
    })
    parentId: string;

    @CreateDateColumn({
        name: 'create_time',
        type: 'timestamp',
        comment: '创建时间'
    })
    createTime: Date;

    @Column({
        name: 'create_by',
        type: 'varchar',
        length: 32,
        comment: '创建人'
    })
    createBy: string;

    @UpdateDateColumn({
        name: 'update_time',
        type: 'timestamp',
        comment: '信息更新时间'
    })
    updateTime: Date;

    @Column({
        name: 'update_by',
        type: 'varchar',
        length: 32,
        nullable: true,
        comment: '信息更新人'
    })
    updateBy: string;
} 