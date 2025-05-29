import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FinExistingGuarantee } from 'src/entities/fin-existing-guarantee.entity';
import { FinExistingGuaranteeAsset } from 'src/entities/fin-existing-guarantee-asset.entity';
import { FinExistingGuaranteeDto } from '../dto/fin-existing-guarantee.dto';
import { FinExistingConverter } from '../converters/fin-existing.converter';
import { Snowflake } from 'src/common/utils/snowflake';
import { UserContext } from 'src/common/context/user-context';
import { Inject } from '@nestjs/common';
import { SNOWFLAKE } from 'src/common/providers';

/**
 * 担保相关辅助工具类
 * 负责担保相关的数据操作和查询
 */
@Injectable()
export class GuaranteeHelper {

  constructor(
    @InjectRepository(FinExistingGuarantee)
    private readonly finExistingGuaranteeRepo: Repository<FinExistingGuarantee>,
    @InjectRepository(FinExistingGuaranteeAsset)
    private readonly finExistingGuaranteeAssetRepo: Repository<FinExistingGuaranteeAsset>,
    private readonly converter: FinExistingConverter,
    @Inject(SNOWFLAKE)
    private readonly snowflake: Snowflake,
    @Inject('UserContext')
    private readonly userContext: UserContext,
  ) {}

  /**
   * 获取担保记录的担保物ID列表
   * @param guaranteeId 担保ID
   * @returns {Promise<string[]>} 担保物ID列表
   */
  async getGuaranteeAssetIds(guaranteeId: string): Promise<string[]> {
    const assets = await this.finExistingGuaranteeAssetRepo.find({
      where: { guaranteeId },
      select: ['assetId']
    });
    return assets.map(asset => asset.assetId);
  }

  /**
   * 获取担保记录的反担保记录列表
   * @param guaranteeId 担保ID
   * @returns {Promise<FinExistingGuarantee[]>} 反担保记录列表
   */
  async getCounterGuarantees(guaranteeId: string): Promise<FinExistingGuarantee[]> {
    return await this.finExistingGuaranteeRepo.find({
      where: { counterGuaranteeId: guaranteeId }
    });
  }

  /**
   * 将融资担保实体转换为DTO
   * @param entity 融资担保实体
   * @param includeRelations 是否包含关联数据（反担保和担保物）
   * @returns {Promise<FinExistingGuaranteeDto>} 融资担保DTO
   */
  async convertToGuaranteeDto(entity: FinExistingGuarantee, includeRelations: boolean = true): Promise<FinExistingGuaranteeDto> {
    const dto = this.converter.convertToGuaranteeDto(entity);

    if (includeRelations) {
      // 获取反担保记录
      const counterGuarantees = await this.getCounterGuarantees(entity.id);
      dto.counterGuarantees = await Promise.all(
        counterGuarantees.map(cg => this.convertToGuaranteeDto(cg, false))
      );

      // 获取担保物ID列表
      dto.assetIds = await this.getGuaranteeAssetIds(entity.id);
    }

    return dto;
  }

  /**
   * 保存担保物关系记录
   * @param guaranteeId 担保ID
   * @param assetIds 担保物ID列表
   * @param queryRunner 查询运行器
   */
  async saveGuaranteeAssets(guaranteeId: string, assetIds: string[], queryRunner: any): Promise<void> {
    if (!assetIds || assetIds.length === 0) {
      return;
    }

    const assetEntities = assetIds.map(assetId => 
      this.finExistingGuaranteeAssetRepo.create({
        id: this.snowflake.nextId().toString(),
        guaranteeId,
        assetId
      })
    );

    await queryRunner.manager.save(assetEntities);
  }

  /**
   * 删除担保物关系记录
   * @param guaranteeId 担保ID
   * @param queryRunner 查询运行器
   */
  async removeGuaranteeAssets(guaranteeId: string, queryRunner: any): Promise<void> {
    await queryRunner.manager.delete(FinExistingGuaranteeAsset, { guaranteeId });
  }

  /**
   * 保存反担保记录（创建或更新）
   * @param guaranteeId 主担保ID
   * @param existingId 存量融资ID
   * @param counterGuaranteeDto 反担保记录DTO
   * @param queryRunner 查询运行器
   * @returns {Promise<FinExistingGuarantee>} 保存的反担保记录
   */
  async saveCounterGuarantee(
    guaranteeId: string, 
    existingId: string,
    counterGuaranteeDto: any, 
    queryRunner: any
  ): Promise<FinExistingGuarantee> {
    // 将保证金从万元转换为分
    const guaranteeBonusInCent = this.converter.convertWanToCent(counterGuaranteeDto.guaranteeBonus);

    let counterGuarantee: FinExistingGuarantee;

    if (counterGuaranteeDto.id) {
      // 更新现有反担保记录
      const existingCounterGuarantee = await this.finExistingGuaranteeRepo.findOne({
        where: { id: counterGuaranteeDto.id, counterGuaranteeId: guaranteeId }
      });

      if (!existingCounterGuarantee) {
        throw new Error(`反担保记录 ${counterGuaranteeDto.id} 不存在或不属于担保 ${guaranteeId}`);
      }

      // 更新反担保记录
      counterGuarantee = this.finExistingGuaranteeRepo.merge(existingCounterGuarantee, {
        guaranteeType: counterGuaranteeDto.guaranteeType,
        isCredit: counterGuaranteeDto.isCredit,
        feeRate: counterGuaranteeDto.feeRate,
        guaranteeBonus: guaranteeBonusInCent,
        updateBy: this.userContext.getUsername()!,
        updateTime: new Date(),
      });
    } else {
      // 创建新的反担保记录
      counterGuarantee = this.finExistingGuaranteeRepo.create({
        id: this.snowflake.nextId().toString(),
        existingId: existingId, // 使用与主担保相同的存量融资ID
        guaranteeType: counterGuaranteeDto.guaranteeType,
        isCredit: counterGuaranteeDto.isCredit,
        feeRate: counterGuaranteeDto.feeRate,
        guaranteeBonus: guaranteeBonusInCent,
        counterGuaranteeId: guaranteeId, // 指向主担保
        createBy: this.userContext.getUsername()!,
        createTime: new Date(),
      });
    }

    // 保存反担保记录
    const savedCounterGuarantee = await queryRunner.manager.save(counterGuarantee);

    // 处理担保物关系：先删除旧的，再保存新的
    if (counterGuaranteeDto.id) {
      // 如果是更新操作，先删除现有的担保物关系
      await this.removeGuaranteeAssets(counterGuaranteeDto.id, queryRunner);
    }
    
    // 保存新的担保物关系
    if (counterGuaranteeDto.assetIds && counterGuaranteeDto.assetIds.length > 0) {
      await this.saveGuaranteeAssets(savedCounterGuarantee.id, counterGuaranteeDto.assetIds, queryRunner);
    }

    return savedCounterGuarantee;
  }
} 