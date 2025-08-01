import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { numberTransformer, booleanTransformer } from '../common/utils/transformers';

@Entity('fin_existing_guarantee_asset')
export class FinExistingGuaranteeAsset {
    @ApiProperty({
        description: '融资担保与担保物关系ID',
        type: Number
    })
    @PrimaryColumn({
        name: 'id',
        type: 'bigint',
        comment: '融资担保与担保物关系 ID',
        transformer: numberTransformer
    })
    id: number;

    @ApiProperty({
        description: '融资担保ID',
        type: Number
    })
    @Column({
        name: 'guarantee_id',
        type: 'bigint',
        nullable: true,
        comment: '融资担保 ID',
        transformer: numberTransformer
    })
    guaranteeId: number;

    @ApiProperty({
        description: '担保物ID',
        type: Number
    })
    @Column({
        name: 'asset_id',
        type: 'bigint',
        nullable: true,
        comment: '担保物 ID',
        transformer: numberTransformer
    })
    assetId: number;

    @ApiProperty({
        description: '备注',
        type: String,
        maxLength: 256
    })
    @Column({
        name: 'comment',
        type: 'varchar',
        length: 256,
        nullable: true,
        comment: '备注'
    })
    comment: string;

    @ApiProperty({
        description: '是否删除',
        type: Boolean
    })
    @Column({
        name: 'is_deleted',
        type: 'tinyint',
        width: 1,
        default: 0,
        comment: '是否删除. 0: 否, 1: 是',
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
        maxLength: 32
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