import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('sys_dict')
export class SysDict {
    @ApiProperty({
        description: '字典ID'
    })
    @PrimaryColumn({ name: 'id', type: 'number', comment: '字典ID' })
    id: number;

    @ApiProperty({
        description: '字典编码',
        uniqueItems: true
    })
    @Column({ name: 'code', type: 'varchar', length: 64, unique: true, comment: '字典编码' })
    code: string;

    @ApiProperty({
        description: '字典名称',
        uniqueItems: true
    })
    @Column({ name: 'name', type: 'varchar', length: 64, unique: true, comment: '字典名称' })
    name: string;

    @ApiProperty({
        description: '字典备注',
        required: false
    })
    @Column({ name: 'comment', type: 'varchar', length: 128, nullable: true, comment: '字典备注' })
    comment?: string;

    @ApiProperty({
        description: '是否启用',
        default: true
    })
    @Column({ name: 'is_enabled', default: true, comment: '是否启用. 0: 禁用, 1: 启用' })
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