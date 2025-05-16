import { Injectable } from '@nestjs/common';

/**
 * 配置服务
 * 用于读取和管理环境变量配置
 */
@Injectable()
export class ConfigService {
  /**
   * 获取储备融资进度步骤列表
   * 从环境变量 RESERVE_PROGRESS_STEPS 中读取，以逗号分隔
   * @returns 进度步骤名称数组
   */
  getReserveProgressSteps(): string[] {
    const steps = process.env.RESERVE_PROGRESS_STEPS || '';
    return steps.split(',').filter(step => step.trim() !== '');
  }
} 