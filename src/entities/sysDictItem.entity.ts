import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('sys_dict_item')
export class SysDictItem {
    @ApiProperty({
        description: '字典项ID'
    })
    @PrimaryColumn({ name: 'id', type: 'number', comment: '字典项ID' })
    id: number;

    @ApiProperty({
        description: '字典ID'
    })
    @Column({ name: 'dict_id', type: 'number', comment: '字典ID' })
    dictId: number;

    @ApiProperty({
        description: '字典编码'
    })
    @Column({ name: 'dict_code', type: 'varchar', length: 64, comment: '字典编码' })
    dictCode: string;

    @ApiProperty({
        description: '字典项标签'
    })
    @Column({ name: 'label', type: 'varchar', length: 64, comment: '字典项标签' })
    label: string;

    @ApiProperty({
        description: '字典项值'
    })
    @Column({ name: 'value', type: 'varchar', length: 64, comment: '字典项值' })
    value: string;

    @ApiProperty({
        description: '字典项备注',
        required: false
    })
    @Column({ name: 'comment', type: 'varchar', length: 128, nullable: true, comment: '字典项备注' })
    comment?: string;

    @ApiProperty({
        description: '字典项排序',
        default: 0
    })
    @Column({ name: 'sort', type: 'number', default: 0, comment: '字典项排序' })
    sort: number;

    @ApiProperty({
        description: '父级字典项ID',
        default: 0
    })
    @Column({ name: 'parent_id', type: 'number', default: 0, comment: '父级字典项ID. 0表示没有父级字典项' })
    parentId: number;

    @ApiProperty({
        description: '是否可被选择',
        default: true
    })
    @Column({ name: 'is_enabled', default: true, comment: '是否可被选择,不对子级生效. 0: 禁用, 1: 启用' })
    isEnabled: boolean;

    @ApiProperty({
        description: '创建时间'
    })
    @CreateDateColumn({
        name: 'create_time',
        type: 'timestamp',
        comment: '创建时间'
    })
    createTime: Date;

    @ApiProperty({
        description: '创建人',
        maxLength: 32
    })
    @Column({
        name: 'create_by',
        type: 'varchar',
        length: 32,
        comment: '创建人'
    })
    createBy: string;

    @ApiProperty({
        description: '更新时间'
    })
    @UpdateDateColumn({
        name: 'update_time',
        type: 'timestamp',
        comment: '信息更新时间'
    })
    updateTime: Date;

    @ApiProperty({
        description: '更新人',
        maxLength: 32,
        required: false
    })
    @Column({
        name: 'update_by',
        type: 'varchar',
        length: 32,
        nullable: true,
        comment: '信息更新人'
    })
    updateBy: string;
} 