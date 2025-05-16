import { ApiProperty } from '@nestjs/swagger';

/**
 * 通用分页响应实体
 */
export class PageResult<T> {
    /**
     * 当前页码
     */
    @ApiProperty({
        description: '当前页码',
        type: Number,
        minimum: 1
    })
    pageNo: number;

    /**
     * 每页数量
     */
    @ApiProperty({
        description: '每页显示记录数',
        type: Number,
        minimum: 1
    })
    pageSize: number;

    /**
     * 总记录数
     */
    @ApiProperty({
        description: '总记录数',
        type: Number,
        minimum: 0
    })
    total: number;

    /**
     * 总页数
     */
    @ApiProperty({
        description: '总页数',
        type: Number,
        minimum: 0
    })
    pages: number;

    /**
     * 分页数据
     */
    @ApiProperty({
        description: '分页数据列表',
        isArray: true
    })
    rows: T[];

    constructor(pageNo: number, pageSize: number, total: number, rows: T[]) {
        this.pageNo = pageNo;
        this.pageSize = pageSize;
        this.total = total;
        this.rows = rows;
        this.pages = Math.ceil(total / pageSize);
    }

    /**
     * 创建分页结果
     */
    static of<T>(pageNo: number, pageSize: number, total: number, rows: T[]): PageResult<T> {
        return new PageResult(pageNo, pageSize, total, rows);
    }
} 