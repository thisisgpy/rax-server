/**
 * 计息基准枚举
 */
export enum DaysCountBasisEnum {
    /** ACT/365 */
    ACT_365 = 1,
    /** ACT/360 */
    ACT_360 = 2,
    /** 30/360 */
    THIRTY_360 = 3
}

/**
 * 计息基准枚举标签映射
 */
export const DaysCountBasisLabels = {
    [DaysCountBasisEnum.ACT_365]: 'ACT/365',
    [DaysCountBasisEnum.ACT_360]: 'ACT/360',
    [DaysCountBasisEnum.THIRTY_360]: '30/360'
}; 