import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { numberTransformer, booleanTransformer } from '../common/utils/transformers';

@Entity('fin_existing_disbursement')
export class FinExistingDisbursement {
    @PrimaryColumn({ 
        type: 'bigint',
        transformer: numberTransformer,
        comment: '融资放款 ID'
    })
    id: number;

    @Column({ 
        type: 'bigint',
        nullable: true,
        transformer: numberTransformer,
        comment: '存量融资 ID'
    })
    existingId: number;

    @Column({ 
        type: 'bigint',
        nullable: true,
        transformer: numberTransformer,
        comment: '放款金额，以分计算'
    })
    amount: number;

    @Column({ 
        type: 'date',
        nullable: true,
        comment: '到账日期'
    })
    accountingDate: Date;

    @Column({ 
        type: 'varchar', 
        length: 64, 
        nullable: true,
        comment: '放款方式'
    })
    disbursementMethod: string;

    @Column({ 
        type: 'date',
        nullable: true,
        comment: '起息日'
    })
    interestStartDate: Date;

    @Column({ 
        type: 'date',
        nullable: true,
        comment: '首次还款日'
    })
    firstRepaymentDate: Date;

    @Column({ 
        type: 'date',
        nullable: true,
        comment: '最后还款日'
    })
    lastRepaymentDate: Date;

    @Column({ 
        type: 'tinyint',
        width: 1,
        default: 0,
        transformer: booleanTransformer,
        comment: '是否删除. 0: 否, 1: 是'
    })
    isDeleted: boolean;

    @CreateDateColumn({
        type: 'datetime',
        comment: '创建时间'
    })
    createTime: Date;

    @Column({ 
        type: 'varchar', 
        length: 32,
        comment: '创建人'
    })
    createBy: string;

    @UpdateDateColumn({
        type: 'datetime',
        nullable: true,
        comment: '信息更新时间'
    })
    updateTime: Date;

    @Column({ 
        type: 'varchar', 
        length: 32, 
        nullable: true,
        comment: '信息更新人'
    })
    updateBy: string;
} 