import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FinExisting } from 'src/entities/fin-existing.entity';
import { FinExistingDisbursement } from 'src/entities/fin-existing-disbursement.entity';
import { FinExistingGuarantee } from 'src/entities/fin-existing-guarantee.entity';
import { RaxBizException } from 'src/common/exceptions/rax-biz.exception';
import { FinExistingConverter } from '../converters/fin-existing.converter';

/**
 * 存量融资业务规则验证器
 * 负责各种业务规则的验证
 */
@Injectable()
export class FinExistingValidator {

  constructor(
    @InjectRepository(FinExisting)
    private readonly finExistingRepo: Repository<FinExisting>,
    @InjectRepository(FinExistingDisbursement)
    private readonly finExistingDisbursementRepo: Repository<FinExistingDisbursement>,
    @InjectRepository(FinExistingGuarantee)
    private readonly finExistingGuaranteeRepo: Repository<FinExistingGuarantee>,
    private readonly converter: FinExistingConverter,
  ) {}

  /**
   * 检查存量融资记录是否存在
   * @param id 存量融资ID
   * @returns {Promise<FinExisting>} 存量融资实体
   * @throws {RaxBizException} 当存量融资记录不存在时
   */
  async checkFinExistingExists(id: string): Promise<FinExisting> {
    const finExisting = await this.finExistingRepo.findOne({
      where: { id }
    });

    if (!finExisting) {
      throw new RaxBizException(`存量融资记录 ${id} 不存在`);
    }

    return finExisting;
  }

  /**
   * 检查融资担保记录是否存在
   * @param id 融资担保ID
   * @returns {Promise<FinExistingGuarantee>} 融资担保实体
   * @throws {RaxBizException} 当融资担保记录不存在时
   */
  async checkGuaranteeExists(id: string): Promise<FinExistingGuarantee> {
    const guarantee = await this.finExistingGuaranteeRepo.findOne({
      where: { id }
    });

    if (!guarantee) {
      throw new RaxBizException(`融资担保记录 ${id} 不存在`);
    }

    return guarantee;
  }

  /**
   * 验证是否为多次放款的修改
   * 如果当前有多条放款记录，不允许修改为单次放款
   * 
   * @param existingId 存量融资ID
   * @param newIsMultiple 新的多次放款标识
   * @throws {RaxBizException} 当违反业务规则时
   */
  async validateIsMultipleChange(existingId: string, newIsMultiple: boolean): Promise<void> {
    if (!newIsMultiple) {
      const disbursementCount = await this.getDisbursementCount(existingId);
      
      if (disbursementCount > 1) {
        throw new RaxBizException(`当前存量融资已有 ${disbursementCount} 条放款记录，不能修改为单次放款`);
      }
    }
  }

  /**
   * 验证融资总额的修改
   * 修改后的总额不能小于已放款金额的总和
   * 
   * @param existingId 存量融资ID
   * @param newFundingAmountInCent 新的融资总额（分）
   * @throws {RaxBizException} 当违反业务规则时
   */
  async validateFundingAmountChange(existingId: string, newFundingAmountInCent: number): Promise<void> {
    const totalDisbursedAmount = await this.getTotalDisbursedAmount(existingId);
    
    if (newFundingAmountInCent < totalDisbursedAmount) {
      throw new RaxBizException(
        `修改后的融资总额（${this.converter.convertCentToString(newFundingAmountInCent)}分）不能小于已放款总金额（${this.converter.convertCentToString(totalDisbursedAmount)}分）`
      );
    }
  }

  /**
   * 获取存量融资的放款记录数量
   * @param existingId 存量融资ID
   * @returns {Promise<number>} 放款记录数量
   */
  private async getDisbursementCount(existingId: string): Promise<number> {
    return await this.finExistingDisbursementRepo.count({
      where: { existingId }
    });
  }

  /**
   * 获取存量融资的已放款总金额
   * @param existingId 存量融资ID
   * @returns {Promise<number>} 已放款总金额（分）
   */
  private async getTotalDisbursedAmount(existingId: string): Promise<number> {
    const result = await this.finExistingDisbursementRepo
      .createQueryBuilder('disbursement')
      .select('SUM(disbursement.amount)', 'totalAmount')
      .where('disbursement.existingId = :existingId', { existingId })
      .getRawOne();

    return Number(result.totalAmount) || 0;
  }
} 