import { Configuration } from 'log4js';

/**
 * log4js 配置
 * 
 * 日志文件：
 * 1. app-yyyy-MM-dd.log：记录所有日志信息
 * 2. error-yyyy-MM-dd.log：仅记录错误日志
 */
export const LOG4JS_CONFIG: Configuration = {
  appenders: {
    // 控制台输出
    console: {
      type: 'console',
      layout: {
        type: 'pattern',
        pattern: '[%d{yyyy-MM-dd hh:mm:ss.SSS}] [%p] [%c] - %m'
      }
    },
    // 应用日志
    app: {
      type: 'dateFile',
      filename: 'logs/app',
      pattern: '-yyyy-MM-dd.log',
      alwaysIncludePattern: true,
      layout: {
        type: 'pattern',
        pattern: '[%d{yyyy-MM-dd hh:mm:ss.SSS}] [%p] [%c] - %m'
      }
    },
    // 错误日志
    error: {
      type: 'dateFile',
      filename: 'logs/error',
      pattern: '-yyyy-MM-dd.log',
      alwaysIncludePattern: true,
      layout: {
        type: 'pattern',
        pattern: '[%d{yyyy-MM-dd hh:mm:ss.SSS}] [%p] [%c] - %m'
      }
    },
    // 错误日志过滤器
    errorFilter: {
      type: 'logLevelFilter',
      appender: 'error',
      level: 'error'
    }
  },
  categories: {
    default: {
      appenders: ['console', 'app'],
      level: 'info'
    },
    app: {
      appenders: ['console', 'app'],
      level: 'info'
    },
    error: {
      appenders: ['console', 'app', 'errorFilter'],
      level: 'error'
    }
  }
}; 