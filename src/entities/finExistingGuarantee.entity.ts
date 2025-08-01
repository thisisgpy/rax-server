import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { numberTransformer, booleanTransformer } from '../common/utils/transformers';

@Entity('fin_existing_guarantee')
export class FinExistingGuarantee {
    @ApiProperty({
        description: '融资担保ID',
        type: Number
    })
    @PrimaryColumn({
        name: 'id',
        type: 'bigint',
        comment: '融资担保 ID',
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
        description: '担保类型',
        type: String,
        maxLength: 64
    })
    @Column({
        name: 'guarantee_type',
        type: 'varchar',
        length: 64,
        nullable: true,
        comment: '担保类型'
    })
    guaranteeType: string;

    @ApiProperty({
        description: '是否为信用担保',
        type: Boolean
    })
    @Column({
        name: 'is_credit',
        type: 'tinyint',
        width: 1,
        nullable: true,
        comment: '是否为信用担保. 0: 否, 1: 是',
        transformer: booleanTransformer
    })
    isCredit: boolean;

    @ApiProperty({
        description: '担保费率',
        type: Number
    })
    @Column({
        name: 'fee_rate',
        type: 'decimal',
        precision: 8,
        scale: 4,
        nullable: true,
        comment: '担保费率'
    })
    feeRate: number;

    @ApiProperty({
        description: '保证金(分)',
        type: Number
    })
    @Column({
        name: 'guarantee_bonus',
        type: 'bigint',
        nullable: true,
        comment: '保证金，以分计算',
        transformer: numberTransformer
    })
    guaranteeBonus: number;

    @ApiProperty({
        description: '反担保的担保ID',
        type: Number
    })
    @Column({
        name: 'counter_guarantee_id',
        type: 'bigint',
        default: 0,
        comment: '反担保的担保 ID. 0 表示这行记录是担保，而不是反担保',
        transformer: numberTransformer
    })
    counterGuaranteeId: number;

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