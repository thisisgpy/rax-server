import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { numberTransformer, booleanTransformer } from '../common/utils/transformers';

@Entity('sys_resource')
export class SysResource {
    @ApiProperty({
        description: '资源ID',
        type: Number
    })
    @PrimaryColumn({
        name: 'id',
        type: 'bigint',
        comment: '资源ID',
        transformer: numberTransformer
    })
    id: number;

    @ApiProperty({
        description: '资源编码',
        type: String,
        maxLength: 64
    })
    @Column({
        name: 'code',
        type: 'varchar',
        length: 64,
        comment: '资源编码'
    })
    code: string;

    @ApiProperty({
        description: '资源名称',
        type: String,
        maxLength: 64
    })
    @Column({
        name: 'name',
        type: 'varchar',
        length: 64,
        comment: '资源名称'
    })
    name: string;

    @ApiProperty({
        description: '资源类型',
        type: Number,
        enum: [0, 1, 2],
        default: 0
    })
    @Column({
        name: 'type',
        type: 'tinyint',
        width: 2,
        default: 0,
        comment: '资源类型. 0:目录, 1:菜单, 2:按钮'
    })
    type: number;

    @ApiProperty({
        description: '父级资源ID',
        type: Number,
        default: 0
    })
    @Column({
        name: 'parent_id',
        type: 'bigint',
        default: 0,
        comment: '父级资源ID. 0表示没有父级资源',
        transformer: numberTransformer
    })
    parentId: number;

    @ApiProperty({
        description: '资源路径',
        type: String,
        maxLength: 128,
        required: false
    })
    @Column({
        name: 'path',
        type: 'varchar',
        length: 128,
        nullable: true,
        comment: '资源路径'
    })
    path?: string;

    @ApiProperty({
        description: '资源组件',
        type: String,
        maxLength: 128,
        required: false
    })
    @Column({
        name: 'component',
        type: 'varchar',
        length: 128,
        nullable: true,
        comment: '资源组件'
    })
    component?: string;

    @ApiProperty({
        description: '资源图标',
        type: String,
        maxLength: 64,
        required: false
    })
    @Column({
        name: 'icon',
        type: 'varchar',
        length: 64,
        nullable: true,
        comment: '资源图标'
    })
    icon?: string;

    @ApiProperty({
        description: '资源排序',
        type: Number,
        default: 0
    })
    @Column({
        name: 'sort',
        type: 'int',
        default: 0,
        comment: '资源排序'
    })
    sort: number;

    @ApiProperty({
        description: '是否隐藏',
        type: Boolean,
        default: false
    })
    @Column({
        name: 'is_hidden',
        default: 0,
        comment: '是否隐藏. 0:否, 1:是',
        transformer: booleanTransformer
    })
    isHidden: boolean;

    @ApiProperty({
        description: '是否缓存',
        type: Boolean,
        default: false
    })
    @Column({
        name: 'is_keep_alive',
        default: 0,
        comment: '是否缓存. 0:否, 1:是',
        transformer: booleanTransformer
    })
    isKeepAlive: boolean;

    @ApiProperty({
        description: '是否外部链接',
        type: Boolean,
        default: false
    })
    @Column({
        name: 'is_external_link',
        default: 0,
        comment: '是否外部链接. 0:否, 1:是',
        transformer: booleanTransformer
    })
    isExternalLink: boolean;

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