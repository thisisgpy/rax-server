import { Injectable } from '@nestjs/common';
import { configure, getLogger, Logger } from 'log4js';
import { LOG4JS_CONFIG } from './logger.config';

/**
 * 日志服务
 * 提供应用日志和错误日志记录功能
 */
@Injectable()
export class LoggerService {
  private readonly appLogger: Logger;
  private readonly errorLogger: Logger;

  constructor() {
    configure(LOG4JS_CONFIG);
    this.appLogger = getLogger('app');
    this.errorLogger = getLogger('error');
  }

  /**
   * 记录调试级别日志
   * @param context 日志上下文
   * @param message 日志消息
   */
  debug(context: string, message: any): void {
    this.appLogger.debug(`[${context}] ${this.formatMessage(message)}`);
  }

  /**
   * 记录信息级别日志
   * @param context 日志上下文
   * @param message 日志消息
   */
  info(context: string, message: any): void {
    this.appLogger.info(`[${context}] ${this.formatMessage(message)}`);
  }

  /**
   * 记录警告级别日志
   * @param context 日志上下文
   * @param message 日志消息
   */
  warn(context: string, message: any): void {
    this.appLogger.warn(`[${context}] ${this.formatMessage(message)}`);
  }

  /**
   * 记录错误级别日志
   * @param context 日志上下文
   * @param error 错误信息或错误对象
   * @param message 额外的错误消息
   */
  error(context: string, error: Error | string, message?: string): void {
    if (error instanceof Error) {
      const errorMessage = message ? `${message} - ${error.message}` : error.message;
      this.errorLogger.error(`[${context}] ${errorMessage}`);
      this.errorLogger.error(`[${context}] Stack: ${error.stack}`);
    } else {
      this.errorLogger.error(`[${context}] ${this.formatMessage(error)}`);
      if (message) {
        this.errorLogger.error(`[${context}] ${this.formatMessage(message)}`);
      }
    }
  }

  /**
   * 格式化日志消息
   * @param message 日志消息
   * @returns 格式化后的消息
   */
  private formatMessage(message: any): string {
    if (typeof message === 'object') {
      return JSON.stringify(message);
    }
    return String(message);
  }
} 