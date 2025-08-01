/**
 * 金融机构类型枚举
 */
export enum InstitutionTypeEnum {
    /** 银行 */
    BANK = 1,
    /** 非银行金融机构 */
    NON_BANK = 2
}

/**
 * 金融机构类型枚举标签映射
 */
export const InstitutionTypeLabels = {
    [InstitutionTypeEnum.BANK]: '银行',
    [InstitutionTypeEnum.NON_BANK]: '非银行金融机构'
}; 