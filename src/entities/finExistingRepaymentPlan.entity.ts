import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { numberTransformer, booleanTransformer } from '../common/utils/transformers';

@Entity('fin_existing_repayment_plan')
export class FinExistingRepaymentPlan {
    @PrimaryColumn({ 
        type: 'bigint',
        transformer: numberTransformer,
        comment: '还本付息计划 ID'
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