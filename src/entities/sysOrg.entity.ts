import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('sys_org')
export class SysOrg {
    @ApiProperty({
        description: '组织ID',
        type: Number
    })
    @PrimaryColumn({
        name: 'id',
        type: 'number',
        comment: '组织ID'
    })
    id: number;

    @ApiProperty({
        description: '组织编码',
        type: String,
        maxLength: 64
    })
    @Column({
        name: 'code',
        type: 'varchar',
        length: 64,
        comment: '组织编码. 4位一级. 0001,00010001,000100010001,以此类推'
    })
    code: string;

    @ApiProperty({
        description: '组织名称',
        type: String,
        maxLength: 64
    })
    @Column({
        name: 'name',
        type: 'varchar',
        length: 64,
        comment: '组织名称'
    })
    name: string;

    @ApiProperty({
        description: '组织名称简称',
        type: String,
        maxLength: 64
    })
    @Column({
        name: 'name_abbr',
        type: 'varchar',
        length: 64,
        comment: '组织名称简称'
    })
    nameAbbr: string;

    @ApiProperty({
        description: '组织备注',
        type: String,
        maxLength: 128,
        required: false
    })
    @Column({
        name: 'comment',
        type: 'varchar',
        length: 128,
        nullable: true,
        comment: '组织备注'
    })
    comment: string;

    @ApiProperty({
        description: '父级组织ID',
        type: Number,
        default: 0
    })
    @Column({
        name: 'parent_id',
        type: 'number',
        default: 0,
        comment: '父级组织ID. 0表示没有父组织'
    })
    parentId: number;

    @ApiProperty({
        description: '创建时间',
        type: Date
    })
    @CreateDateColumn({
        name: 'create_time',
        type: 'timestamp',
        comment: '创建时间'
    })
    createTime: Date;

    @ApiProperty({
        description: '创建人',
        type: String,
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
        description: '更新时间',
        type: Date
    })
    @UpdateDateColumn({
        name: 'update_time',
        type: 'timestamp',
        comment: '信息更新时间'
    })
    updateTime: Date;

    @ApiProperty({
        description: '更新人',
        type: String,
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