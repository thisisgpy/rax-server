import { Entity, PrimaryColumn, Column, UpdateDateColumn } from 'typeorm';
import { numberTransformer, booleanTransformer } from '../common/utils/transformers';

@Entity('fin_existing_disbursement_repayment_plan_rel')
export class FinExistingDisbursementRepaymentPlanRel {
    @PrimaryColumn({ 
        type: 'bigint',
        transformer: numberTransformer,
        comment: '融资放款与还本付息计划关系 ID'
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
        type: 'tinyint',
        width: 1,
        default: 0,
        transformer: booleanTransformer,
        comment: '是否作废.0:否, 1:是'
    })
    isValid: boolean;

    @Column({ 
        type: 'varchar', 
        length: 512, 
        nullable: true,
        comment: '作废原因'
    })
    invalidComment: string;

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