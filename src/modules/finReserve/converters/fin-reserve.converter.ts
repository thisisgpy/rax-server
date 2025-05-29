import { Injectable } from '@nestjs/common';
import { FinReserve } from 'src/entities/finReserve.entity';
import { ReserveBaseInfoDto } from '../dto/reserve-detail.dto';
import { ReserveListItemDto } from '../dto/reserve-list.dto';

/**
 * 融资储备转换器
 * 负责实体与DTO之间的转换，以及金额单位转换
 */
@Injectable()
export class FinReserveConverter {

  /**
   * 万元转分
   * @param wanAmount 万元金额（字符串或数字）
   * @returns {number} 分金额（整数）
   */
  convertWanToCent(wanAmount: string | number): number {
    const amount = typeof wanAmount === 'string' ? parseFloat(wanAmount) : wanAmount;
    return Math.round(amount * 1000000);
  }

  /**
   * 分转万元
   * @param centAmount 分金额（整数）
   * @returns {number} 万元金额
   */
  convertCentToWan(centAmount: number): number {
    return centAmount / 1000000;
  }

  /**
   * 将储备融资实体转换为基本信息DTO
   * @param reserve 储备融资实体
   * @returns {ReserveBaseInfoDto} 储备融资基本信息DTO
   */
  convertToBaseInfoDto(reserve: FinReserve): ReserveBaseInfoDto {
    const baseInfo = new ReserveBaseInfoDto();
    baseInfo.id = reserve.id;
    baseInfo.code = reserve.code;
    baseInfo.orgId = reserve.orgId;
    baseInfo.financialInstitution = reserve.financialInstitution;
    baseInfo.fundingMode = reserve.fundingMode;
    // 将分转换为万元
    baseInfo.fundingAmount = this.convertCentToWan(reserve.fundingAmount);
    baseInfo.expectedDisbursementDate = reserve.expectedDisbursementDate;
    baseInfo.loanRenewalFromId = reserve.loanRenewalFromId;
    baseInfo.leaderName = reserve.leaderName;
    baseInfo.leaderId = reserve.leaderId;
    baseInfo.executorName = reserve.executorName;
    baseInfo.executorId = reserve.executorId;
    baseInfo.combinedRatio = reserve.combinedRatio;
    // 将分转换为万元
    baseInfo.additionalCosts = this.convertCentToWan(reserve.additionalCosts);
    baseInfo.status = reserve.status;
    baseInfo.createTime = reserve.createTime;
    baseInfo.createBy = reserve.createBy;
    baseInfo.updateTime = reserve.updateTime;
    baseInfo.updateBy = reserve.updateBy;
    return baseInfo;
  }

  /**
   * 将储备融资实体转换为列表项DTO
   * @param reserve 储备融资实体
   * @returns {ReserveListItemDto} 储备融资列表项DTO
   */
  convertToListItemDto(reserve: FinReserve): ReserveListItemDto {
    const listItem = new ReserveListItemDto();
    listItem.id = reserve.id;
    listItem.code = reserve.code;
    listItem.orgId = reserve.orgId;
    listItem.financialInstitution = reserve.financialInstitution;
    listItem.fundingMode = reserve.fundingMode;
    // 将分转换为万元
    listItem.fundingAmount = this.convertCentToWan(reserve.fundingAmount);
    listItem.combinedRatio = reserve.combinedRatio;
    listItem.expectedDisbursementDate = reserve.expectedDisbursementDate;
    listItem.leaderName = reserve.leaderName;
    listItem.executorName = reserve.executorName;
    listItem.status = reserve.status;
    return listItem;
  }
} 