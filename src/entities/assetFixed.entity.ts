import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { numberTransformer, booleanTransformer } from '../common/utils/transformers';

@Entity('asset_fixed')
export class AssetFixed {
    @ApiProperty({
        description: '固定资产ID',
        type: Number
    })
    @PrimaryColumn({
        name: 'id',
        type: 'bigint',
        comment: '固定资产ID',
        transformer: numberTransformer
    })
    id: number;

    @ApiProperty({
        description: '固定资产名称',
        type: String,
        maxLength: 128
    })
    @Column({
        name: 'name',
        type: 'varchar',
        length: 128,
        nullable: true,
        comment: '固定资产名称'
    })
    name: string;

    @ApiProperty({
        description: '所属组织ID',
        type: Number
    })
    @Column({
        name: 'org_id',
        type: 'bigint',
        comment: '所属组织ID',
        transformer: numberTransformer
    })
    orgId: number;

    @ApiProperty({
        description: '是否删除',
        type: Boolean,
        default: false
    })
    @Column({
        name: 'is_deleted',
        type: 'tinyint',
        width: 1,
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
    updateBy: string;
} 