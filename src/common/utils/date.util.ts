/**
 * 日期工具类
 */
export class DateUtil {
  /**
   * 计算两个日期之间的天数差
   * 只比较日期部分，忽略时间部分
   * 
   * @param date1 日期1
   * @param date2 日期2
   * @returns 天数差（date2 - date1）
   *          - 正数：date2 晚于 date1
   *          - 0：同一天
   *          - 负数：date2 早于 date1
   */
  static calculateDaysDifference(date1: Date | string, date2: Date | string): number {
    // 确保转换为 Date 对象
    const d1 = date1 instanceof Date ? date1 : new Date(date1);
    const d2 = date2 instanceof Date ? date2 : new Date(date2);

    // 移除时分秒，只保留日期部分
    d1.setHours(0, 0, 0, 0);
    d2.setHours(0, 0, 0, 0);

    const oneDay = 24 * 60 * 60 * 1000; // 一天的毫秒数
    const diffTime = d2.getTime() - d1.getTime();
    return Math.round(diffTime / oneDay);
  }

  /**
   * 检查日期是否有效
   * @param date 要检查的日期
   * @returns 是否为有效日期
   */
  static isValidDate(date: Date | string): boolean {
    if (typeof date === 'string') {
      date = new Date(date);
    }
    return date instanceof Date && !isNaN(date.getTime());
  }
} 