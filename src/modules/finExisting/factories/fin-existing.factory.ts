import { Injectable, Inject } from '@nestjs/common';
import { FinExisting } from 'src/entities/fin-existing.entity';
import { FinExistingGuarantee } from 'src/entities/fin-existing-guarantee.entity';
import { CreateFinExistingDto } from '../dto/create-fin-existing.dto';
import { CreateFinExistingGuaranteeDto } from '../dto/create-fin-existing-guarantee.dto';
import { UpdateFinExistingGuaranteeDto } from '../dto/update-fin-existing-guarantee.dto';
import { FinExistingConverter } from '../converters/fin-existing.converter';
import { Snowflake } from 'src/common/utils/snowflake';
import { UserContext } from 'src/common/context/user-context';
import { CodeUtil } from 'src/common/utils/code.util';
import { SNOWFLAKE } from 'src/common/providers';

/**
 * 存量融资实体工厂
 * 负责创建和更新各种实体对象
 */
@Injectable()
export class FinExistingFactory {

  constructor(
    private readonly converter: FinExistingConverter,
    @Inject(SNOWFLAKE)
    private readonly snowflake: Snowflake,
    @Inject('UserContext')
    private readonly userContext: UserContext,
  ) {}

  /**
   * 创建存量融资实体
   * @param createDto 创建存量融资的数据传输对象
   * @returns {FinExisting} 存量融资实体
   */
  createFinExistingEntity(createDto: CreateFinExistingDto): FinExisting {
    // 将金额从万元转换为分
    const fundingAmountInCent = this.converter.convertWanToCent(createDto.fundingAmount);

    const finExisting = new FinExisting();
    finExisting.id = this.snowflake.nextId().toString();
    finExisting.code = CodeUtil.generateFinExistingCode();
    finExisting.reserveId = createDto.reserveId;
    finExisting.orgId = createDto.orgId;
    finExisting.orgCode = createDto.orgCode;
    finExisting.finName = createDto.finName;
    finExisting.fundingStructure = createDto.fundingStructure;
    finExisting.fundingMode = createDto.fundingMode;
    finExisting.financialInstitution = createDto.financialInstitution;
    finExisting.fundingAmount = fundingAmountInCent;
    finExisting.finTerm = createDto.finTerm;
    finExisting.loanRenewalFromId = createDto.loanRenewalFromId;
    
    // 现在这些字段都是必填的，直接赋值
    finExisting.returnInterestRate = createDto.returnInterestRate;
    finExisting.repaymentPeriod = createDto.repaymentPeriod;
    finExisting.repaymentMethod = createDto.repaymentMethod;
    finExisting.interestType = createDto.interestType;
    finExisting.loanPrimeRate = createDto.loanPrimeRate;
    finExisting.basisPoint = createDto.basisPoint;
    finExisting.daysCountBasis = createDto.daysCountBasis;
    finExisting.includeSettlementDate = createDto.includeSettlementDate;
    finExisting.repaymentDelayDays = createDto.repaymentDelayDays;
    finExisting.isMultiple = createDto.isMultiple;
    finExisting.isPublic = createDto.isPublic;

    finExisting.createBy = this.userContext.getUsername()!;
    finExisting.createTime = new Date();
    finExisting.isDeleted = false;

    return finExisting;
  }

  /**
   * 创建部分更新对象
   * @param updateDto 更新存量融资的数据传输对象
   * @returns {Partial<FinExisting>} 部分更新对象
   */
  createUpdateData(updateDto: any): Partial<FinExisting> {
    const updateData: Partial<FinExisting> = {
      updateBy: this.userContext.getUsername()!,
      updateTime: new Date(),
    };

    // 只更新有值的字段
    if (updateDto.reserveId !== undefined) {
      updateData.reserveId = updateDto.reserveId;
    }
    if (updateDto.orgId !== undefined) {
      updateData.orgId = updateDto.orgId;
    }
    if (updateDto.orgCode !== undefined) {
      updateData.orgCode = updateDto.orgCode;
    }
    if (updateDto.finName !== undefined) {
      updateData.finName = updateDto.finName;
    }
    if (updateDto.fundingStructure !== undefined) {
      updateData.fundingStructure = updateDto.fundingStructure;
    }
    if (updateDto.fundingMode !== undefined) {
      updateData.fundingMode = updateDto.fundingMode;
    }
    if (updateDto.financialInstitution !== undefined) {
      updateData.financialInstitution = updateDto.financialInstitution;
    }
    if (updateDto.returnInterestRate !== undefined) {
      updateData.returnInterestRate = updateDto.returnInterestRate;
    }
    if (updateDto.repaymentPeriod !== undefined) {
      updateData.repaymentPeriod = updateDto.repaymentPeriod;
    }
    if (updateDto.repaymentMethod !== undefined) {
      updateData.repaymentMethod = updateDto.repaymentMethod;
    }
    if (updateDto.interestType !== undefined) {
      updateData.interestType = updateDto.interestType;
    }
    if (updateDto.loanPrimeRate !== undefined) {
      updateData.loanPrimeRate = updateDto.loanPrimeRate;
    }
    if (updateDto.basisPoint !== undefined) {
      updateData.basisPoint = updateDto.basisPoint;
    }
    if (updateDto.daysCountBasis !== undefined) {
      updateData.daysCountBasis = updateDto.daysCountBasis;
    }
    if (updateDto.includeSettlementDate !== undefined) {
      updateData.includeSettlementDate = updateDto.includeSettlementDate;
    }
    if (updateDto.repaymentDelayDays !== undefined) {
      updateData.repaymentDelayDays = updateDto.repaymentDelayDays;
    }
    if (updateDto.loanRenewalFromId !== undefined) {
      updateData.loanRenewalFromId = updateDto.loanRenewalFromId;
    }
    if (updateDto.finTerm !== undefined) {
      updateData.finTerm = updateDto.finTerm;
    }
    if (updateDto.isPublic !== undefined) {
      updateData.isPublic = updateDto.isPublic;
    }

    // 处理融资总额（需要转换）
    if (updateDto.fundingAmount !== undefined) {
      updateData.fundingAmount = this.converter.convertWanToCent(updateDto.fundingAmount);
    }

    // 处理是否为多次放款
    if (updateDto.isMultiple !== undefined) {
      updateData.isMultiple = updateDto.isMultiple;
    }

    return updateData;
  }

  /**
   * 创建软删除更新对象
   * @returns {Partial<FinExisting>} 软删除更新对象
   */
  createSoftDeleteData(): Partial<FinExisting> {
    return {
      isDeleted: true,
      updateBy: this.userContext.getUsername()!,
      updateTime: new Date(),
    };
  }

  /**
   * 创建融资担保实体
   * @param createDto 创建融资担保的数据传输对象
   * @returns {FinExistingGuarantee} 融资担保实体
   */
  createGuaranteeEntity(createDto: CreateFinExistingGuaranteeDto): FinExistingGuarantee {
    // 将保证金从万元转换为分
    const guaranteeBonusInCent = this.converter.convertWanToCent(createDto.guaranteeBonus);

    const guarantee = new FinExistingGuarantee();
    guarantee.id = this.snowflake.nextId().toString();
    guarantee.existingId = createDto.existingId;
    guarantee.guaranteeType = createDto.guaranteeType;
    guarantee.isCredit = createDto.isCredit;
    guarantee.feeRate = createDto.feeRate;
    guarantee.guaranteeBonus = guaranteeBonusInCent;
    guarantee.counterGuaranteeId = '0'; // 主担保记录
    guarantee.createBy = this.userContext.getUsername()!;
    guarantee.createTime = new Date();

    return guarantee;
  }

  /**
   * 创建担保更新对象
   * @param updateDto 更新融资担保的数据传输对象
   * @returns {Partial<FinExistingGuarantee>} 担保更新对象
   */
  createGuaranteeUpdateData(updateDto: UpdateFinExistingGuaranteeDto): Partial<FinExistingGuarantee> {
    const updateData: Partial<FinExistingGuarantee> = {
      updateBy: this.userContext.getUsername()!,
      updateTime: new Date(),
    };

    // 只更新有值的字段
    if (updateDto.guaranteeType !== undefined) {
      updateData.guaranteeType = updateDto.guaranteeType;
    }
    if (updateDto.isCredit !== undefined) {
      updateData.isCredit = updateDto.isCredit;
    }
    if (updateDto.feeRate !== undefined) {
      updateData.feeRate = updateDto.feeRate;
    }
    if (updateDto.guaranteeBonus !== undefined) {
      updateData.guaranteeBonus = this.converter.convertWanToCent(updateDto.guaranteeBonus);
    }

    return updateData;
  }
} 