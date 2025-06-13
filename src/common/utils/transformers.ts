import { ValueTransformer } from 'typeorm';

/**
 * 数字转换器，将 bigint 字符串转换为数字
 */
export const numberTransformer: ValueTransformer = {
    to: (value: number) => value,
    from: (value: string) => parseInt(value, 10)
};

/**
 * Boolean转换器，将数据库中的0/1转换为JavaScript的false/true
 */
export const booleanTransformer: ValueTransformer = {
    to: (value: boolean) => value ? 1 : 0,
    from: (value: any) => {
        // 处理不同类型的输入值
        if (typeof value === 'boolean') {
            return value;
        }
        if (typeof value === 'number') {
            return value === 1;
        }
        if (typeof value === 'string') {
            return value === '1';
        }
        // 默认返回false
        return false;
    }
}; 