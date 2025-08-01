/**
 * 还款周期枚举
 */
export enum RepaymentPeriodEnum {
    /** 每月还款 */
    MONTHLY = 1,
    /** 每季度还款 */
    QUARTERLY = 2,
    /** 每半年还款 */
    SEMI_ANNUALLY = 3,
    /** 每年还款 */
    ANNUALLY = 4,
    /** 不定期还款 */
    IRREGULAR = 5,
    /** 其他 */
    OTHER = 6
}

/**
 * 还款周期枚举标签映射
 */
export const RepaymentPeriodLabels = {
    [RepaymentPeriodEnum.MONTHLY]: '每月还款',
    [RepaymentPeriodEnum.QUARTERLY]: '每季度还款',
    [RepaymentPeriodEnum.SEMI_ANNUALLY]: '每半年还款',
    [RepaymentPeriodEnum.ANNUALLY]: '每年还款',
    [RepaymentPeriodEnum.IRREGULAR]: '不定期还款',
    [RepaymentPeriodEnum.OTHER]: '其他'
}; 