import { ApiProperty } from '@nestjs/swagger';

/**
 * 字典项树节点
 */
export class DictItemTreeDto {
    /**
     * 字典项ID
     */
    @ApiProperty({
        description: '字典项ID',
        type: String
    })
    id: string;

    /**
     * 字典项标签
     */
    @ApiProperty({
        description: '字典项标签',
        type: String
    })
    label: string;

    /**
     * 字典项值
     */
    @ApiProperty({
        description: '字典项值',
        type: String
    })
    value: string;

    /**
     * 字典项备注
     */
    @ApiProperty({
        description: '字典项备注',
        type: String,
        required: false
    })
    comment?: string;

    /**
     * 排序
     */
    @ApiProperty({
        description: '排序号',
        type: Number,
        minimum: 0
    })
    sort: number;

    /**
     * 是否启用
     */
    @ApiProperty({
        description: '是否启用',
        type: Boolean
    })
    isEnabled: boolean;

    /**
     * 子节点
     */
    @ApiProperty({
        description: '子节点列表',
        type: [DictItemTreeDto],
        required: false,
        isArray: true
    })
    children?: DictItemTreeDto[];
}

/**
 * 字典树结果
 */
export class DictItemTreeResult {
    /**
     * 字典编码
     */
    @ApiProperty({
        description: '字典编码',
        type: String
    })
    code: string;

    /**
     * 字典名称
     */
    @ApiProperty({
        description: '字典名称',
        type: String
    })
    name: string;

    /**
     * 字典项列表
     */
    @ApiProperty({
        description: '字典项列表',
        type: [DictItemTreeDto],
        isArray: true
    })
    items: DictItemTreeDto[];
} 