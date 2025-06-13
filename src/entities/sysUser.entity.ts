import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { numberTransformer, booleanTransformer } from '../common/utils/transformers';

@Entity('sys_user')
export class SysUser {
    @ApiProperty({
        description: '用户ID',
        type: Number
    })
    @PrimaryColumn({
        name: 'id',
        type: 'bigint',
        comment: '用户ID',
        transformer: numberTransformer
    })
    id: number;

    @ApiProperty({
        description: '组织ID',
        type: Number
    })
    @Column({
        name: 'org_id',
        type: 'bigint',
        comment: '组织ID',
        transformer: numberTransformer
    })
    orgId: number;

    @ApiProperty({
        description: '手机号',
        type: String,
        maxLength: 11
    })
    @Column({
        name: 'mobile',
        type: 'varchar',
        length: 11,
        comment: '手机号'
    })
    mobile: string;

    @ApiProperty({
        description: '用户名称',
        type: String,
        maxLength: 64
    })
    @Column({
        name: 'name',
        type: 'varchar',
        length: 64,
        comment: '用户名称'
    })
    name: string;

    @ApiProperty({
        description: '性别',
        type: String,
        enum: ['男', '女'],
        default: '男'
    })
    @Column({
        name: 'gender',
        type: 'varchar',
        length: 8,
        default: '男',
        comment: '性别. 男, 女'
    })
    gender: string;

    @ApiProperty({
        description: '身份证号',
        type: String,
        maxLength: 18,
        required: false
    })
    @Column({
        name: 'id_card',
        type: 'varchar',
        length: 18,
        nullable: true,
        comment: '身份证号'
    })
    idCard?: string;

    @ApiProperty({
        description: '密码',
        type: String,
        maxLength: 256
    })
    @Column({
        name: 'password',
        type: 'varchar',
        length: 256,
        comment: '密码'
    })
    password: string;

    @ApiProperty({
        description: '是否已修改了初始密码',
        type: Boolean,
        default: false
    })
    @Column({
        name: 'is_init_password',
        default: 0,
        comment: '是否已修改了初始密码. 0:否, 1:是',
        transformer: booleanTransformer
    })
    isInitPassword: boolean = false;

    @ApiProperty({
        description: '状态',
        type: Number,
        enum: [0, 1],
        default: 1
    })
    @Column({
        name: 'status',
        type: 'tinyint',
        width: 2,
        default: 1,
        comment: '状态. 0:禁用, 1:启用'
    })
    status: number;

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