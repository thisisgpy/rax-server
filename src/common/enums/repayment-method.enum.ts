/**
 * 还款方式枚举
 */
export enum RepaymentMethodEnum {
    /** 先息后本 */
    INTEREST_FIRST = 1,
    /** 定期还本付息 */
    REGULAR_PRINCIPAL_INTEREST = 2,
    /** 到期一次性还本付息 */
    MATURITY_LUMP_SUM = 3,
    /** 定期付息不定期还本 */
    REGULAR_INTEREST_IRREGULAR_PRINCIPAL = 4,
    /** 定期还本不定期付息 */
    REGULAR_PRINCIPAL_IRREGULAR_INTEREST = 5,
    /** 其他 */
    OTHER = 6
}

/**
 * 还款方式枚举标签映射
 */
export const RepaymentMethodLabels = {
    [RepaymentMethodEnum.INTEREST_FIRST]: '先息后本',
    [RepaymentMethodEnum.REGULAR_PRINCIPAL_INTEREST]: '定期还本付息',
    [RepaymentMethodEnum.MATURITY_LUMP_SUM]: '到期一次性还本付息',
    [RepaymentMethodEnum.REGULAR_INTEREST_IRREGULAR_PRINCIPAL]: '定期付息不定期还本',
    [RepaymentMethodEnum.REGULAR_PRINCIPAL_IRREGULAR_INTEREST]: '定期还本不定期付息',
    [RepaymentMethodEnum.OTHER]: '其他'
}; 