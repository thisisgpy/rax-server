import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.OK; // 统一返回 200，通过 success 字段区分
    let message = '服务器内部错误';

    if (exception instanceof BadRequestException) {
      // 处理验证错误
      const exceptionResponse = exception.getResponse() as any;
      
      if (typeof exceptionResponse === 'string') {
        // 自定义格式的验证错误（来自 ValidationPipe）
        message = exceptionResponse;
      } else if (exceptionResponse.message && Array.isArray(exceptionResponse.message)) {
        // 默认的 class-validator 验证错误
        const errorMessages = this.formatValidationErrorsToString(exceptionResponse.message);
        message = errorMessages;
      } else if (typeof exceptionResponse.message === 'string') {
        message = exceptionResponse.message;
      } else {
        message = '请求参数错误';
      }
    } else if (exception instanceof HttpException) {
      // 处理其他 HTTP 异常
      const exceptionResponse = exception.getResponse() as any;
      
      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (exceptionResponse.message) {
        message = exceptionResponse.message;
      }
    } else if (exception instanceof Error) {
      // 处理普通错误
      message = exception.message || '服务器内部错误';
      console.error('Unexpected error:', exception);
    } else {
      // 处理未知错误
      console.error('Unknown error:', exception);
    }

    // 统一的响应格式
    const responseBody = {
      success: false,
      message,
      data: null
    };

    response.status(status).json(responseBody);
  }

  /**
   * 格式化验证错误信息为字符串
   * @param validationErrors 验证错误数组
   * @returns 格式化后的错误信息字符串
   */
  private formatValidationErrorsToString(validationErrors: string[]): string {
    const errors: string[] = [];
    
    validationErrors.forEach(error => {
      // 解析错误信息，提取字段名和错误描述
      // 格式通常是 "fieldName error message"
      const spaceIndex = error.indexOf(' ');
      if (spaceIndex > 0) {
        const field = error.substring(0, spaceIndex);
        const message = error.substring(spaceIndex + 1);
        errors.push(`${field}: ${message}`);
      } else {
        errors.push(error);
      }
    });

    return errors.join('; ');
  }

  /**
   * 格式化验证错误信息（保留原方法以防兼容性问题）
   * @param validationErrors 验证错误数组
   * @returns 格式化后的错误信息
   */
  private formatValidationErrors(validationErrors: string[]): any {
    const errors: { [key: string]: string[] } = {};
    
    validationErrors.forEach(error => {
      // 解析错误信息，提取字段名和错误描述
      // 格式通常是 "fieldName error message"
      const spaceIndex = error.indexOf(' ');
      if (spaceIndex > 0) {
        const field = error.substring(0, spaceIndex);
        const message = error.substring(spaceIndex + 1);
        
        if (!errors[field]) {
          errors[field] = [];
        }
        errors[field].push(message);
      } else {
        // 如果无法解析，放到通用错误中
        if (!errors['general']) {
          errors['general'] = [];
        }
        errors['general'].push(error);
      }
    });

    return errors;
  }
} 