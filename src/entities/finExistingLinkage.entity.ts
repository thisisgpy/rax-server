import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { numberTransformer, booleanTransformer } from '../common/utils/transformers';

@Entity('fin_existing_linkage')
export class FinExistingLinkage {
    @ApiProperty({
        description: '融资勾稽ID',
        type: Number
    })
    @PrimaryColumn({
        name: 'id',
        type: 'bigint',
        comment: '融资勾稽 ID',
        transformer: numberTransformer
    })
    id: number;

    @ApiProperty({
        description: '存量融资ID',
        type: Number
    })
    @Column({
        name: 'existing_id',
        type: 'bigint',
        nullable: true,
        comment: '存量融资 ID',
        transformer: numberTransformer
    })
    existingId: number;

    @ApiProperty({
        description: '储备融资ID',
        type: Number
    })
    @Column({
        name: 'reserve_id',
        type: 'bigint',
        nullable: true,
        comment: '储备融资 ID',
        transformer: numberTransformer
    })
    reserveId: number;

    @ApiProperty({
        description: '勾稽金额(分)',
        type: Number
    })
    @Column({
        name: 'linkage_amount',
        type: 'bigint',
        nullable: true,
        comment: '勾稽金额，以分计算',
        transformer: numberTransformer
    })
    linkageAmount: number;

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