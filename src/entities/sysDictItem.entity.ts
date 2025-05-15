import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity('sys_dict_item')
export class SysDictItem {
    @PrimaryColumn({ name: 'id', comment: '字典项ID' })
    id: string;

    @Column({ name: 'dict_id', comment: '字典ID' })
    dictId: string;

    @Column({ name: 'dict_code', comment: '字典编码' })
    dictCode: string;

    @Column({ name: 'label', comment: '字典项标签' })
    label: string;

    @Column({ name: 'value', comment: '字典项值' })
    value: string;

    @Column({ name: 'comment', nullable: true, comment: '字典项备注' })
    comment?: string;

    @Column({ name: 'sort', default: 0, comment: '字典项排序' })
    sort: number;

    @Column({ name: 'parent_id', default: '0', comment: '父级字典项ID. 0表示没有父级字典项' })
    parentId: string;

    @Column({ name: 'is_enabled', default: true, comment: '是否可被选择,不对子级生效. 0: 禁用, 1: 启用' })
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