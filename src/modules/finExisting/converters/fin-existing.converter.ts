import { Injectable } from '@nestjs/common';
import { FinExisting } from 'src/entities/fin-existing.entity';
import { FinExistingGuarantee } from 'src/entities/fin-existing-guarantee.entity';
import { FinExistingListItemDto } from '../dto/fin-existing-list.dto';
import { FinExistingGuaranteeDto } from '../dto/fin-existing-guarantee.dto';

/**
 * 存量融资数据转换器
 * 负责实体与DTO之间的转换
 */
@Injectable()
export class FinExistingConverter {

  /**
   * 将金额字符串从万元转换为分
   * 处理规则：
   * 1. 输入为万元金额的字符串格式，已验证格式正确
   * 2. 转换为分（整数），避免精度问题
   * 
   * @param amountInWanStr 万元金额字符串
   * @returns 分为单位的金额
   */
  convertWanToCent(amountInWanStr: string): number {
    // 移除小数点，统一按照 6 位小数处理
    const parts = amountInWanStr.split('.');
    const integerPart = parts[0];
    const decimalPart = (parts[1] || '').padEnd(6, '0');
    
    // 直接拼接整数部分和小数部分，得到分为单位的金额
    const amountInCent = parseInt(integerPart + decimalPart, 10);
    
    return amountInCent;
  }

  /**
   * 将金额从分转换为字符串格式（分为单位）
   * @param amountInCent 分为单位的金额
   * @returns 分为单位的金额字符串
   */
  convertCentToString(amountInCent: number): string {
    return amountInCent.toString();
  }

  /**
   * 将存量融资实体转换为列表项DTO
   * @param entity 存量融资实体
   * @returns 列表项DTO
   */
  convertToListItemDto(entity: FinExisting): FinExistingListItemDto {
    const dto = new FinExistingListItemDto();
    dto.id = entity.id;
    dto.code = entity.code;
    dto.reserveId = entity.reserveId;
    dto.orgId = entity.orgId;
    dto.orgCode = entity.orgCode;
    dto.finName = entity.finName;
    dto.fundingStructure = entity.fundingStructure;
    dto.fundingMode = entity.fundingMode;
    dto.financialInstitution = entity.financialInstitution;
    dto.fundingAmount = this.convertCentToString(entity.fundingAmount); // 金额转换为字符串（分）
    dto.returnInterestRate = entity.returnInterestRate; // 直接赋值数字类型
    dto.repaymentPeriod = entity.repaymentPeriod;
    dto.repaymentMethod = entity.repaymentMethod;
    dto.interestType = entity.interestType;
    dto.loanPrimeRate = entity.loanPrimeRate; // 直接赋值数字类型
    dto.basisPoint = entity.basisPoint; // 直接赋值数字类型
    dto.daysCountBasis = entity.daysCountBasis;
    dto.includeSettlementDate = entity.includeSettlementDate;
    dto.repaymentDelayDays = entity.repaymentDelayDays;
    dto.loanRenewalFromId = entity.loanRenewalFromId;
    dto.isMultiple = entity.isMultiple;
    dto.finTerm = entity.finTerm;
    dto.isPublic = entity.isPublic;
    dto.createTime = entity.createTime;
    dto.createBy = entity.createBy;
    dto.updateTime = entity.updateTime;
    dto.updateBy = entity.updateBy;
    return dto;
  }

  /**
   * 将融资担保实体转换为DTO（基础版本，不包含关联数据）
   * @param entity 融资担保实体
   * @returns 融资担保DTO
   */
  convertToGuaranteeDto(entity: FinExistingGuarantee): FinExistingGuaranteeDto {
    const dto = new FinExistingGuaranteeDto();
    dto.id = entity.id;
    dto.existingId = entity.existingId;
    dto.guaranteeType = entity.guaranteeType;
    dto.isCredit = entity.isCredit;
    dto.feeRate = entity.feeRate;
    dto.guaranteeBonus = this.convertCentToString(entity.guaranteeBonus);
    dto.counterGuaranteeId = entity.counterGuaranteeId;
    dto.createTime = entity.createTime;
    dto.createBy = entity.createBy;
    dto.updateTime = entity.updateTime;
    dto.updateBy = entity.updateBy;
    return dto;
  }
} 