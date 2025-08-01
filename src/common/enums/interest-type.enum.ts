/**
 * 利率类型枚举
 */
export enum InterestTypeEnum {
    /** 固定利率 */
    FIXED = 1,
    /** 浮动利率 */
    FLOATING = 2
}

/**
 * 利率类型枚举标签映射
 */
export const InterestTypeLabels = {
    [InterestTypeEnum.FIXED]: '固定利率',
    [InterestTypeEnum.FLOATING]: '浮动利率'
}; 