import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { numberTransformer, booleanTransformer } from '../common/utils/transformers';
import { InstitutionTypeEnum, RepaymentMethodEnum, RepaymentPeriodEnum, InterestTypeEnum, DaysCountBasisEnum } from '../common/enums';

@Entity('fin_existing')
export class FinExisting {
    @ApiProperty({
        description: '存量融资ID',
        type: Number
    })
    @PrimaryColumn({
        name: 'id',
        type: 'bigint',
        comment: '存量融资 ID',
        transformer: numberTransformer
    })
    id: number;

    @ApiProperty({
        description: '存量融资编码',
        type: String,
        maxLength: 64
    })
    @Column({
        name: 'code',
        type: 'varchar',
        length: 64,
        nullable: true,
        comment: '存量融资编码. 编码规则: EF 开头，后面跟 yyMMddHHmmss'
    })
    code: string;

    @ApiProperty({
        description: '储备融资ID',
        type: Number
    })
    @Column({
        name: 'reserve_id',
        type: 'bigint',
        nullable: true,
        comment: '储备融资 ID. 0 表示非储备融资转入',
        transformer: numberTransformer
    })
    reserveId: number;

    @ApiProperty({
        description: '融资主体ID',
        type: Number
    })
    @Column({
        name: 'org_id',
        type: 'bigint',
        nullable: true,
        comment: '融资主体 ID',
        transformer: numberTransformer
    })
    orgId: number;

    @ApiProperty({
        description: '融资主体编码',
        type: String,
        maxLength: 64
    })
    @Column({
        name: 'org_code',
        type: 'varchar',
        length: 64,
        nullable: true,
        comment: '融资主体编码'
    })
    orgCode: string;

    @ApiProperty({
        description: '融资名称',
        type: String,
        maxLength: 64
    })
    @Column({
        name: 'fin_name',
        type: 'varchar',
        length: 64,
        nullable: true,
        comment: '融资名称'
    })
    finName: string;

    @ApiProperty({
        description: '融资结构',
        type: String,
        maxLength: 64
    })
    @Column({
        name: 'funding_structure',
        type: 'varchar',
        length: 64,
        nullable: true,
        comment: '融资结构'
    })
    fundingStructure: string;

    @ApiProperty({
        description: '融资方式',
        type: String,
        maxLength: 64
    })
    @Column({
        name: 'funding_mode',
        type: 'varchar',
        length: 64,
        nullable: true,
        comment: '融资方式'
    })
    fundingMode: string;

    @ApiProperty({
        description: '金融机构类型',
        enum: InstitutionTypeEnum
    })
    @Column({
        name: 'institution_type',
        type: 'tinyint',
        width: 2,
        nullable: true,
        comment: '金融机构类型. 1: 银行, 2: 非银行金融机构'
    })
    institutionType: InstitutionTypeEnum;

    @ApiProperty({
        description: '金融机构ID',
        type: Number
    })
    @Column({
        name: 'financial_institution_id',
        type: 'bigint',
        nullable: true,
        comment: '金融机构 ID',
        transformer: numberTransformer
    })
    financialInstitutionId: number;

    @ApiProperty({
        description: '金融机构名称',
        type: String,
        maxLength: 64
    })
    @Column({
        name: 'financial_institution_name',
        type: 'varchar',
        length: 64,
        nullable: true,
        comment: '金融机构名称'
    })
    financialInstitutionName: string;

    @ApiProperty({
        description: '融资总额(分)',
        type: Number
    })
    @Column({
        name: 'funding_amount',
        type: 'bigint',
        nullable: true,
        comment: '融资总额，以分计算',
        transformer: numberTransformer
    })
    fundingAmount: number;

    @ApiProperty({
        description: '放款总额(分)',
        type: Number
    })
    @Column({
        name: 'disbursement_amount',
        type: 'bigint',
        nullable: true,
        comment: '放款总额，以分计算',
        transformer: numberTransformer
    })
    disbursementAmount: number;

    @ApiProperty({
        description: '回报利率',
        type: Number
    })
    @Column({
        name: 'return_interest_rate',
        type: 'decimal',
        precision: 8,
        scale: 4,
        nullable: true,
        comment: '回报利率'
    })
    returnInterestRate: number;

    @ApiProperty({
        description: '还款周期',
        enum: RepaymentPeriodEnum
    })
    @Column({
        name: 'repayment_period',
        type: 'tinyint',
        width: 2,
        nullable: true,
        comment: '还款周期'
    })
    repaymentPeriod: RepaymentPeriodEnum;

    @ApiProperty({
        description: '还款方式',
        enum: RepaymentMethodEnum
    })
    @Column({
        name: 'repayment_method',
        type: 'tinyint',
        width: 2,
        nullable: true,
        comment: '还款方式'
    })
    repaymentMethod: RepaymentMethodEnum;

    @ApiProperty({
        description: '利率类型',
        enum: InterestTypeEnum
    })
    @Column({
        name: 'interest_type',
        type: 'tinyint',
        width: 2,
        nullable: true,
        comment: '利率类型'
    })
    interestType: InterestTypeEnum;

    @ApiProperty({
        description: '基准利率',
        type: Number
    })
    @Column({
        name: 'loan_prime_rate',
        type: 'decimal',
        precision: 8,
        scale: 4,
        nullable: true,
        comment: '基准利率'
    })
    loanPrimeRate: number;

    @ApiProperty({
        description: '基点',
        type: Number
    })
    @Column({
        name: 'basis_point',
        type: 'decimal',
        precision: 8,
        scale: 4,
        nullable: true,
        comment: '基点'
    })
    basisPoint: number;

    @ApiProperty({
        description: '计息基准',
        enum: DaysCountBasisEnum
    })
    @Column({
        name: 'days_count_basis',
        type: 'tinyint',
        width: 2,
        nullable: true,
        comment: '计息基准'
    })
    daysCountBasis: DaysCountBasisEnum;

    @ApiProperty({
        description: '结息日当日是否计息',
        type: Boolean
    })
    @Column({
        name: 'include_settlement_date',
        type: 'tinyint',
        width: 1,
        nullable: true,
        comment: '结息日当日是否计息. 0: 否, 1: 是',
        transformer: booleanTransformer
    })
    includeSettlementDate: boolean;

    @ApiProperty({
        description: '还款日相对于结息日的延迟天数',
        type: Number
    })
    @Column({
        name: 'repayment_delay_days',
        type: 'int',
        width: 11,
        default: 0,
        comment: '还款日相对于结息日的延迟天数'
    })
    repaymentDelayDays: number;

    @ApiProperty({
        description: '续贷来源ID',
        type: Number
    })
    @Column({
        name: 'loan_renewal_from_id',
        type: 'bigint',
        default: 0,
        comment: '续贷来源 ID.0 表示非续贷',
        transformer: numberTransformer
    })
    loanRenewalFromId: number;

    @ApiProperty({
        description: '是否为多次放款',
        type: Boolean
    })
    @Column({
        name: 'is_multiple',
        type: 'tinyint',
        width: 1,
        default: 0,
        comment: '是否为多次放款. 0: 否, 1: 是',
        transformer: booleanTransformer
    })
    isMultiple: boolean;

    @ApiProperty({
        description: '融资期限(月)',
        type: Number
    })
    @Column({
        name: 'fin_term',
        type: 'int',
        width: 11,
        nullable: true,
        comment: '融资期限，以月为单位'
    })
    finTerm: number;

    @ApiProperty({
        description: '融资到期日',
        type: Date
    })
    @Column({
        name: 'maturity_date',
        type: 'date',
        nullable: true,
        comment: '融资到期日.即合同截止日，不是最后还款日'
    })
    maturityDate: Date;

    @ApiProperty({
        description: '是否为公开融资',
        type: Boolean
    })
    @Column({
        name: 'is_public',
        type: 'tinyint',
        width: 1,
        default: 1,
        comment: '是否为公开融资. 0: 否, 1: 是',
        transformer: booleanTransformer
    })
    isPublic: boolean;

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