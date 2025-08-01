import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { numberTransformer, booleanTransformer } from '../common/utils/transformers';

@Entity('fin_existing_disbursement')
export class FinExistingDisbursement {
    @ApiProperty({
        description: '融资放款ID',
        type: Number
    })
    @PrimaryColumn({
        name: 'id',
        type: 'bigint',
        comment: '融资放款 ID',
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
        description: '放款金额(分)',
        type: Number
    })
    @Column({
        name: 'amount',
        type: 'bigint',
        nullable: true,
        comment: '放款金额，以分计算',
        transformer: numberTransformer
    })
    amount: number;

    @ApiProperty({
        description: '到账日期',
        type: Date
    })
    @Column({
        name: 'accounting_date',
        type: 'date',
        nullable: true,
        comment: '到账日期'
    })
    accountingDate: Date;

    @ApiProperty({
        description: '放款方式',
        type: String,
        maxLength: 64
    })
    @Column({
        name: 'disbursement_method',
        type: 'varchar',
        length: 64,
        nullable: true,
        comment: '放款方式'
    })
    disbursementMethod: string;

    @ApiProperty({
        description: '起息日',
        type: Date
    })
    @Column({
        name: 'interest_start_date',
        type: 'date',
        nullable: true,
        comment: '起息日'
    })
    interestStartDate: Date;

    @ApiProperty({
        description: '首次还款日',
        type: Date
    })
    @Column({
        name: 'first_repayment_date',
        type: 'date',
        nullable: true,
        comment: '首次还款日'
    })
    firstRepaymentDate: Date;

    @ApiProperty({
        description: '最后还款日',
        type: Date
    })
    @Column({
        name: 'last_repayment_date',
        type: 'date',
        nullable: true,
        comment: '最后还款日'
    })
    lastRepaymentDate: Date;

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