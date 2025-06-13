import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { numberTransformer, booleanTransformer } from '../common/utils/transformers';

@Entity('sys_role')
export class SysRole {
    @ApiProperty({
        description: '角色ID',
        type: Number
    })
    @PrimaryColumn({
        name: 'id',
        type: 'bigint',
        comment: '角色ID',
        transformer: numberTransformer
    })
    id: number;

    @ApiProperty({
        description: '角色编码',
        type: String,
        maxLength: 64
    })
    @Column({
        name: 'code',
        type: 'varchar',
        length: 64,
        comment: '角色编码'
    })
    code: string;

    @ApiProperty({
        description: '角色名称',
        type: String,
        maxLength: 64
    })
    @Column({
        name: 'name',
        type: 'varchar',
        length: 64,
        comment: '角色名称'
    })
    name: string;

    @ApiProperty({
        description: '角色备注',
        type: String,
        maxLength: 128,
        required: false
    })
    @Column({
        name: 'comment',
        type: 'varchar',
        length: 128,
        nullable: true,
        comment: '角色备注'
    })
    comment?: string;

    @ApiProperty({
        description: '是否删除',
        type: Boolean,
        default: false
    })
    @Column({
        name: 'is_deleted',
        default: 0,
        comment: '是否删除. 0:否, 1:是',
        transformer: booleanTransformer
    })
    isDeleted: boolean;

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
    updateBy?: string;
} 