/**
 * 字典项树节点
 */
export class DictItemTreeDto {
    /**
     * 字典项ID
     */
    id: string;

    /**
     * 字典项标签
     */
    label: string;

    /**
     * 字典项值
     */
    value: string;

    /**
     * 字典项备注
     */
    comment?: string;

    /**
     * 排序
     */
    sort: number;

    /**
     * 是否启用
     */
    isEnabled: boolean;

    /**
     * 子节点
     */
    children?: DictItemTreeDto[];
}

/**
 * 字典树结果
 */
export class DictItemTreeResult {
    /**
     * 字典编码
     */
    code: string;

    /**
     * 字典名称
     */
    name: string;

    /**
     * 字典项列表
     */
    items: DictItemTreeDto[];
} 