import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { numberTransformer, booleanTransformer } from '../common/utils/transformers';

@Entity('fin_existing_repayment_plan_item')
export class FinExistingRepaymentPlanItem {
    @PrimaryColumn({ 
        type: 'bigint',
        transformer: numberTransformer,
        comment: '还本付息明细 ID'
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
        comment: '融资放款 ID'
    })
    disbursementId: number;

    @Column({ 
        type: 'bigint',
        nullable: true,
        transformer: numberTransformer,
        comment: '还本付息计划 ID'
    })
    repaymentPlanId: number;

    @Column({ 
        type: 'int',
        nullable: true,
        comment: '期数'
    })
    period: number;

    @Column({ 
        type: 'date',
        nullable: true,
        comment: '结息日'
    })
    interestSettleDate: Date;

    @Column({ 
        type: 'int',
        nullable: true,
        comment: '计息天数'
    })
    interestCalculateDate: number;

    @Column({ 
        type: 'date',
        nullable: true,
        comment: '还款日期'
    })
    repaymentDate: Date;

    @Column({ 
        type: 'date',
        nullable: true,
        comment: '确认还款日期.即执行还款操作的具体日期'
    })
    confirmRepaymentDate: Date;

    @Column({ 
        type: 'tinyint',
        width: 2,
        default: 0,
        comment: '还款状态. 0:待还款, 1:正常还款, 2:提前还款'
    })
    repaymentStatus: number;

    @Column({ 
        type: 'bigint',
        nullable: true,
        transformer: numberTransformer,
        comment: '预测还款本金，以分计算'
    })
    estimatedRepaymentPrincipal: number;

    @Column({ 
        type: 'bigint',
        nullable: true,
        transformer: numberTransformer,
        comment: '预测还款利息，以分计算'
    })
    estimatedRepaymentInterest: number;

    @Column({ 
        type: 'bigint',
        nullable: true,
        transformer: numberTransformer,
        comment: '预测还款总额，以分计算'
    })
    estimatedRepaymentAmount: number;

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