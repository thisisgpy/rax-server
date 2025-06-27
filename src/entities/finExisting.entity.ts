import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { numberTransformer, booleanTransformer } from '../common/utils/transformers';

@Entity('fin_existing')
export class FinExisting {
    @PrimaryColumn({ 
        type: 'bigint',
        transformer: numberTransformer,
        comment: '存量融资 ID'
    })
    id: number;

    @Column({ 
        type: 'varchar', 
        length: 64, 
        nullable: true,
        comment: '存量融资编码. 编码规则: EF 开头，后面跟 yyMMddHHmmss'
    })
    code: string;

    @Column({ 
        type: 'bigint',
        nullable: true,
        transformer: numberTransformer,
        comment: '储备融资 ID. 0 表示非储备融资转入'
    })
    reserveId: number;

    @Column({ 
        type: 'bigint',
        nullable: true,
        transformer: numberTransformer,
        comment: '融资主体 ID'
    })
    orgId: number;

    @Column({ 
        type: 'varchar', 
        length: 64, 
        nullable: true,
        comment: '融资主体编码'
    })
    orgCode: string;

    @Column({ 
        type: 'varchar', 
        length: 64, 
        nullable: true,
        comment: '融资名称'
    })
    finName: string;

    @Column({ 
        type: 'varchar', 
        length: 64, 
        nullable: true,
        comment: '融资结构'
    })
    fundingStructure: string;

    @Column({ 
        type: 'varchar', 
        length: 64, 
        nullable: true,
        comment: '融资方式'
    })
    fundingMode: string;

    @Column({ 
        type: 'tinyint',
        width: 2,
        nullable: true,
        comment: '金融机构类型. 1: 银行, 2: 非银行金融机构'
    })
    institutionType: number;

    @Column({ 
        type: 'bigint',
        nullable: true,
        transformer: numberTransformer,
        comment: '金融机构 ID'
    })
    financialInstitutionId: number;

    @Column({ 
        type: 'varchar', 
        length: 64, 
        nullable: true,
        comment: '金融机构名称'
    })
    financialInstitutionName: string;

    @Column({ 
        type: 'bigint',
        nullable: true,
        transformer: numberTransformer,
        comment: '融资总额，以分计算'
    })
    fundingAmount: number;

    @Column({ 
        type: 'decimal',
        precision: 8,
        scale: 4,
        nullable: true,
        comment: '回报利率'
    })
    returnInterestRate: number;

    @Column({ 
        type: 'tinyint',
        width: 2,
        nullable: true,
        comment: '还款周期'
    })
    repaymentPeriod: number;

    @Column({ 
        type: 'tinyint',
        width: 2,
        nullable: true,
        comment: '还款方式'
    })
    repaymentMethod: number;

    @Column({ 
        type: 'tinyint',
        width: 2,
        nullable: true,
        comment: '利息类型'
    })
    interestType: number;

    @Column({ 
        type: 'decimal',
        precision: 8,
        scale: 4,
        nullable: true,
        comment: '基准利率'
    })
    loanPrimeRate: number;

    @Column({ 
        type: 'decimal',
        precision: 8,
        scale: 4,
        nullable: true,
        comment: '基点'
    })
    basisPoint: number;

    @Column({ 
        type: 'tinyint',
        width: 2,
        nullable: true,
        comment: '计息基准'
    })
    daysCountBasis: number;

    @Column({ 
        type: 'tinyint',
        width: 1,
        default: 1,
        transformer: booleanTransformer,
        comment: '结息日当日是否计息. 0: 否, 1: 是'
    })
    includeSettlementDate: boolean;

    @Column({ 
        type: 'int',
        default: 0,
        comment: '还款日相对于结息日的延迟天数'
    })
    repaymentDelayDays: number;

    @Column({ 
        type: 'bigint',
        default: 0,
        transformer: numberTransformer,
        comment: '续贷来源 ID.0 表示非续贷'
    })
    loanRenewalFromId: number;

    @Column({ 
        type: 'tinyint',
        width: 1,
        default: 0,
        transformer: booleanTransformer,
        comment: '是否为多次放款. 0: 否, 1: 是'
    })
    isMultiple: boolean;

    @Column({ 
        type: 'int',
        nullable: true,
        comment: '融资期限，以月为单位'
    })
    finTerm: number;

    @Column({ 
        type: 'date',
        nullable: true,
        comment: '融资到期日.即合同截止日，不是最后还款日'
    })
    maturityDate: Date;

    @Column({ 
        type: 'tinyint',
        width: 1,
        default: 1,
        transformer: booleanTransformer,
        comment: '是否为公开融资. 0: 否, 1: 是'
    })
    isPublic: boolean;

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