import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { numberTransformer, booleanTransformer } from '../common/utils/transformers';

@Entity('fin_existing_guarantee_asset')
export class FinExistingGuaranteeAsset {
    @PrimaryColumn({ 
        type: 'bigint',
        transformer: numberTransformer,
        comment: '融资担保与担保物关系 ID'
    })
    id: number;

    @Column({ 
        type: 'bigint',
        nullable: true,
        transformer: numberTransformer,
        comment: '融资担保 ID'
    })
    guaranteeId: number;

    @Column({ 
        type: 'bigint',
        nullable: true,
        transformer: numberTransformer,
        comment: '担保物 ID'
    })
    assetId: number;

    @Column({ 
        type: 'varchar', 
        length: 256, 
        nullable: true,
        comment: '备注'
    })
    comment: string;

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