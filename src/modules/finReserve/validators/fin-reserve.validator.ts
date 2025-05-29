import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FinReserve, FinReserveStatus } from 'src/entities/finReserve.entity';
import { FinReserveProgress } from 'src/entities/finReserveProgress.entity';
import { RaxBizException } from 'src/common/exceptions/rax-biz.exception';
import { DateUtil } from 'src/common/utils/date.util';

/**
 * 融资储备验证器
 * 负责业务规则验证和数据有效性检查
 */
@Injectable()
export class FinReserveValidator {

  constructor(
    @InjectRepository(FinReserve)
    private readonly finReserveRepository: Repository<FinReserve>,
    @InjectRepository(FinReserveProgress)
    private readonly finReserveProgressRepository: Repository<FinReserveProgress>,
  ) {}

  /**
   * 检查储备融资记录是否存在
   * @param id 储备融资ID
   * @returns {Promise<FinReserve>} 储备融资实体
   * @throws {RaxBizException} 当储备融资记录不存在时
   */
  async checkReserveExists(id: string): Promise<FinReserve> {
    const reserve = await this.finReserveRepository.findOne({
      where: { id }
    });

    if (!reserve) {
      throw new RaxBizException(`储备融资记录 ${id} 不存在`);
    }

    return reserve;
  }

  /**
   * 检查储备融资记录是否存在
   * @param id 进度记录ID
   * @returns {Promise<FinReserveProgress>} 进度记录实体
   * @throws {RaxBizException} 当进度记录不存在时
   */
  async checkProgressExists(id: string): Promise<FinReserveProgress> {
    const progress = await this.finReserveProgressRepository.findOne({
      where: { id }
    });

    if (!progress) {
      throw new RaxBizException(`进度记录 ${id} 不存在`);
    }

    return progress;
  }

  /**
   * 验证储备融资状态是否允许编辑
   * @param reserve 储备融资实体
   * @throws {RaxBizException} 当状态不允许编辑时
   */
  validateEditableStatus(reserve: FinReserve): void {
    if (reserve.status !== FinReserveStatus.PENDING) {
      throw new RaxBizException('只有待放款状态的储备融资可以被编辑');
    }
  }

  /**
   * 验证储备融资状态是否允许取消
   * @param reserve 储备融资实体
   * @throws {RaxBizException} 当状态不允许取消时
   */
  validateCancellableStatus(reserve: FinReserve): void {
    if (reserve.status !== FinReserveStatus.PENDING) {
      throw new RaxBizException('只有待放款状态的储备融资可以被取消');
    }
  }

  /**
   * 验证储备融资状态是否允许删除
   * @param reserve 储备融资实体
   * @throws {RaxBizException} 当状态不允许删除时
   */
  validateDeletableStatus(reserve: FinReserve): void {
    if (![FinReserveStatus.PENDING, FinReserveStatus.CANCELLED].includes(reserve.status)) {
      throw new RaxBizException('只有待放款和已取消状态的储备融资可以被删除');
    }
  }

  /**
   * 验证进度更新是否允许
   * @param reserveId 储备融资ID
   * @param progressList 新的进度列表
   * @throws {RaxBizException} 当试图修改已完成的进度时
   */
  async validateProgressUpdate(reserveId: string, progressList: any[]): Promise<void> {
    // 获取现有的进度记录
    const existingProgresses = await this.finReserveProgressRepository.find({
      where: { reserveId }
    });

    // 检查是否试图修改已有实际日期的进度
    const progressMap = new Map(existingProgresses.map(p => [p.progressName, p]));
    for (const newProgress of progressList) {
      const existingProgress = progressMap.get(newProgress.progressName);
      if (existingProgress?.actualDate) {
        throw new RaxBizException(`进度"${newProgress.progressName}"已填写实际日期，不允许编辑`);
      }
    }
  }

  /**
   * 验证进度确认是否允许
   * @param progress 进度记录
   * @param actualDate 实际完成日期
   * @throws {RaxBizException} 当进度已完成或日期无效时
   */
  validateProgressConfirmation(progress: FinReserveProgress, actualDate: Date): void {
    // 检查是否已完成
    if (progress.actualDate) {
      throw new RaxBizException('该进度已完成，不允许重复确认');
    }

    // 检查实际完成日期是否有效
    if (!DateUtil.isValidDate(actualDate)) {
      throw new RaxBizException('实际完成日期格式无效');
    }
  }
} 