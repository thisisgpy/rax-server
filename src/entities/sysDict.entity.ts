import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity('sys_dict')
export class SysDict {
    @PrimaryColumn({ name: 'id', comment: '字典ID' })
    id: string;

    @Column({ name: 'code', unique: true, comment: '字典编码' })
    code: string;

    @Column({ name: 'name', unique: true, comment: '字典名称' })
    name: string;

    @Column({ name: 'comment', nullable: true, comment: '字典备注' })
    comment?: string;

    @Column({ name: 'is_enabled', default: true, comment: '是否启用. 0: 禁用, 1: 启用' })
    isEnabled: boolean;

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