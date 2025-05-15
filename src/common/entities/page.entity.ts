/**
 * 通用分页响应实体
 */
export class PageResult<T> {
    /**
     * 当前页码
     */
    pageNo: number;

    /**
     * 每页数量
     */
    pageSize: number;

    /**
     * 总记录数
     */
    total: number;

    /**
     * 总页数
     */
    pages: number;

    /**
     * 分页数据
     */
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