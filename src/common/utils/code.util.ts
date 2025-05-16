/**
 * 生成储备融资编码
 * 编码规则: RF 开头，后面跟 yyMMddHHmmss
 */
export class CodeUtil {
  /**
   * 生成储备融资编码
   * @returns 储备融资编码，格式：RFyyMMddHHmmss
   */
  static generateReserveCode(): string {
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2);
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    
    return `RF${year}${month}${day}${hours}${minutes}${seconds}`;
  }
} 