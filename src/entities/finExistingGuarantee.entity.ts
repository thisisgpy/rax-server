import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { numberTransformer, booleanTransformer } from '../common/utils/transformers';

@Entity('fin_existing_guarantee')
export class FinExistingGuarantee {
    @PrimaryColumn({ 
        type: 'bigint',
        transformer: numberTransformer,
        comment: '融资担保 ID'
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
        type: 'varchar', 
        length: 64, 
        nullable: true,
        comment: '担保类型'
    })
    guaranteeType: string;

    @Column({ 
        type: 'tinyint',
        width: 1,
        nullable: true,
        transformer: booleanTransformer,
        comment: '是否为信用担保. 0: 否, 1: 是'
    })
    isCredit: boolean;

    @Column({ 
        type: 'decimal',
        precision: 8,
        scale: 4,
        nullable: true,
        comment: '担保费率'
    })
    feeRate: number;

    @Column({ 
        type: 'bigint',
        nullable: true,
        transformer: numberTransformer,
        comment: '保证金，以分计算'
    })
    guaranteeBonus: number;

    @Column({ 
        type: 'bigint',
        default: 0,
        transformer: numberTransformer,
        comment: '反担保的担保 ID. 0 表示这行记录是担保，而不是反担保'
    })
    counterGuaranteeId: number;

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