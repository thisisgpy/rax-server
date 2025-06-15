import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

/**
 * 文件名编码修复管道
 * 
 * 解决中文文件名在 multipart/form-data 传输过程中的乱码问题
 * 
 * 原理：
 * 当中文文件名被错误编码为 latin1 时，会显示为ASCII范围内的乱码字符
 * 通过检测文件名是否只包含ASCII字符，判断是否需要进行编码转换
 */
@Injectable()
export class FileNameEncodePipe implements PipeTransform {
    transform(value: Express.Multer.File, metadata: ArgumentMetadata): Express.Multer.File {
        if (!value || !value.originalname) {
            return value;
        }

        // 检查文件名是否只包含ASCII字符（\u0000-\u00ff）
        // 如果只包含ASCII字符，但原本应该是中文文件名，则可能是乱码
        if (!/[^\u0000-\u00ff]/.test(value.originalname)) {
            try {
                // 尝试从 latin1 转换为 utf8
                const decoded = Buffer.from(value.originalname, 'latin1').toString('utf8');
                
                // 验证转换后的字符串是否包含有效的中文字符
                if (this.containsChineseChars(decoded)) {
                    value.originalname = decoded;
                }
            } catch (error) {
                // 转换失败，保持原文件名
                console.warn('文件名编码转换失败:', value.originalname, error);
            }
        }

        return value;
    }

    /**
     * 检查字符串是否包含中文字符
     * @param str 待检查的字符串
     * @returns 是否包含中文字符
     */
    private containsChineseChars(str: string): boolean {
        // 中文字符的Unicode范围
        const chineseRegex = /[\u4e00-\u9fff\u3400-\u4dbf\uf900-\ufaff]/;
        return chineseRegex.test(str);
    }
} 