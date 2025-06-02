/**
 * 生成融资编码
 */
export class CodeUtil {

  /**
   * 生成储备融资编码
   * @returns 储备融资编码，格式：RFyyMMddHHmmss
   */
  static generateFinReserveCode(): string {
    return `RF${this.generateDateFormatString()}`;
  }

  /**
   * 生成存量融资编码
   * @returns 存量融资编码，格式：EFyyMMddHHmmss
   */
  static generateFinExistingCode(): string {
    return `EF${this.generateDateFormatString()}`;
  }
  
  /**
   * 生成日期格式字符串
   * @returns 日期格式字符串，格式：yyMMddHHmmss
   */
  static generateDateFormatString(): string {
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2);
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    return `${year}${month}${day}${hours}${minutes}${seconds}`;
  }
} 