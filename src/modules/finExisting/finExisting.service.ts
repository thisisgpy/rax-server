import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, Like } from 'typeorm';
import { FinExisting } from '../../entities/finExisting.entity';
import { FinExistingDisbursement } from '../../entities/finExistingDisbursement.entity';
import { FinExistingGuarantee } from '../../entities/finExistingGuarantee.entity';
import { FinExistingGuaranteeAsset } from '../../entities/finExistingGuaranteeAsset.entity';
import { FinExistingLinkage } from '../../entities/finExistingLinkage.entity';
import { SysOrg } from '../../entities/sysOrg.entity';
import { CreateFinExistingDto } from './dto/create-fin-existing.dto';
import { UpdateFinExistingDto } from './dto/update-fin-existing.dto';
import { QueryFinExistingDto } from './dto/query-fin-existing.dto';
import { FinExistingResponseDto, FinExistingListItemDto } from './dto/fin-existing-response.dto';
import { PageResult } from '../../common/entities/page.entity';
import { RaxBizException } from '../../common/exceptions/rax-biz.exception';
import { SNOWFLAKE } from '../../common/providers';
import { Snowflake } from '../../common/utils/snowflake';
import { UserContext } from '../../common/context/user-context';
import { LoggerService } from '../../common/logger/logger.service';
import { CodeUtil } from '../../common/utils/code.util';

@Injectable()
export class FinExistingService {
    private readonly CONTEXT = 'FinExistingService';

    constructor(
        @InjectRepository(FinExisting)
        private readonly finExistingRepository: Repository<FinExisting>,
        @InjectRepository(FinExistingDisbursement)
        private readonly disbursementRepository: Repository<FinExistingDisbursement>,
        @InjectRepository(FinExistingGuarantee)
        private readonly guaranteeRepository: Repository<FinExistingGuarantee>,
        @InjectRepository(FinExistingGuaranteeAsset)
        private readonly guaranteeAssetRepository: Repository<FinExistingGuaranteeAsset>,
        @InjectRepository(FinExistingLinkage)
        private readonly linkageRepository: Repository<FinExistingLinkage>,
        @InjectRepository(SysOrg)
        private readonly sysOrgRepository: Repository<SysOrg>,
        @Inject(SNOWFLAKE)
        private readonly snowflake: Snowflake,
        private readonly dataSource: DataSource,
        @Inject('UserContext')
        private readonly userContext: UserContext,
        private readonly logger: LoggerService
    ) {}

    /**
     * 创建存量融资
     * @param createDto 创建存量融资的数据
     * @returns 创建的存量融资
     * @throws {RaxBizException} 业务异常
     */
    async create(createDto: CreateFinExistingDto): Promise<FinExisting> {
        this.logger.info(this.CONTEXT, `创建存量融资开始: ${JSON.stringify(createDto)}`);
        
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            // 1. 验证融资主体是否存在
            const org = await queryRunner.manager.findOne(SysOrg, {
                where: { id: createDto.orgId }
            });
            if (!org) {
                throw new RaxBizException(`融资主体不存在: ${createDto.orgId}`);
            }

            // 2. 验证业务规则
            await this.validateBusinessRules(createDto, queryRunner);

            // 3. 创建存量融资记录
            const existingId = this.snowflake.nextId();
            const { fundingAmount, ...createFields } = createDto;
            const finExisting = queryRunner.manager.create(FinExisting, {
                id: existingId,
                code: CodeUtil.generateFinExistingCode(),
                orgCode: org.code,
                fundingAmount: this.convertAmountToYuan(fundingAmount),
                disbursementAmount: 0, // 初始为0，通过放款记录累加
                ...createFields,
                isDeleted: false,
                createBy: this.userContext.getUsername()!,
                createTime: new Date()
            });

            const savedFinExisting = await queryRunner.manager.save(finExisting);

            // 4. 创建放款记录
            if (createDto.disbursements && createDto.disbursements.length > 0) {
                const disbursements = await this.createDisbursements(existingId, createDto.disbursements, queryRunner);
                
                // 更新放款总额
                const totalDisbursementAmount = disbursements.reduce((sum, d) => sum + d.amount, 0);
                savedFinExisting.disbursementAmount = totalDisbursementAmount;
                await queryRunner.manager.save(savedFinExisting);
            }

            // 5. 创建担保记录
            if (createDto.guarantees && createDto.guarantees.length > 0) {
                await this.createGuarantees(existingId, createDto.guarantees, queryRunner);
            }

            // 6. 创建勾稽关系
            if (createDto.linkages && createDto.linkages.length > 0) {
                await this.createLinkages(existingId, createDto.linkages, queryRunner);
            }

            await queryRunner.commitTransaction();
            this.logger.info(this.CONTEXT, `创建存量融资成功: ID=${savedFinExisting.id}`);
            return savedFinExisting;

        } catch (error) {
            await queryRunner.rollbackTransaction();
            this.logger.error(this.CONTEXT, error, `创建存量融资失败: ${JSON.stringify(createDto)}`);
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    /**
     * 更新存量融资
     * @param updateDto 更新存量融资的数据
     * @returns 更新后的存量融资
     * @throws {RaxBizException} 业务异常
     */
    async update(updateDto: UpdateFinExistingDto): Promise<FinExisting> {
        this.logger.info(this.CONTEXT, `更新存量融资开始: ${JSON.stringify(updateDto)}`);
        
        // 查询存量融资是否存在
        const finExisting = await this.finExistingRepository.findOne({
            where: { id: updateDto.id, isDeleted: false }
        });

        if (!finExisting) {
            throw new RaxBizException(`存量融资不存在: ${updateDto.id}`);
        }

        try {
            // 验证融资主体是否存在（如果有变更）
            if (updateDto.orgId && updateDto.orgId !== finExisting.orgId) {
                const org = await this.sysOrgRepository.findOne({
                    where: { id: updateDto.orgId }
                });
                if (!org) {
                    throw new RaxBizException(`融资主体不存在: ${updateDto.orgId}`);
                }
                finExisting.orgCode = org.code;
            }

            // 更新存量融资信息（只更新提供的字段，排除fundingAmount）
            const { id, ...updateFields } = updateDto;
            Object.assign(finExisting, {
                ...updateFields,
                updateBy: this.userContext.getUsername()!,
                updateTime: new Date()
            });

            const updatedFinExisting = await this.finExistingRepository.save(finExisting);
            this.logger.info(this.CONTEXT, `更新存量融资成功: ID=${updatedFinExisting.id}`);
            return updatedFinExisting;
        } catch (error) {
            this.logger.error(this.CONTEXT, error, `更新存量融资失败: ${JSON.stringify(updateDto)}`);
            throw error;
        }
    }

    /**
     * 删除存量融资（软删除）
     * @param id 存量融资ID
     * @returns 删除是否成功
     * @throws {RaxBizException} 业务异常
     */
    async delete(id: number): Promise<boolean> {
        this.logger.info(this.CONTEXT, `删除存量融资开始: ID=${id}`);
        
        // 查询存量融资是否存在
        const finExisting = await this.finExistingRepository.findOne({
            where: { id, isDeleted: false }
        });

        if (!finExisting) {
            throw new RaxBizException(`存量融资不存在: ${id}`);
        }

        try {
            finExisting.isDeleted = true;
            finExisting.updateBy = this.userContext.getUsername()!;
            finExisting.updateTime = new Date();

            await this.finExistingRepository.save(finExisting);
            this.logger.info(this.CONTEXT, `删除存量融资成功: ID=${id}`);
            return true;
        } catch (error) {
            this.logger.error(this.CONTEXT, error, `删除存量融资失败: ID=${id}`);
            throw error;
        }
    }

    /**
     * 根据ID获取存量融资详情
     * @param id 存量融资ID
     * @returns 存量融资详情
     * @throws {RaxBizException} 业务异常
     */
    async findById(id: number): Promise<FinExistingResponseDto> {
        this.logger.info(this.CONTEXT, `查询存量融资详情: ID=${id}`);
        
        const queryBuilder = this.finExistingRepository
            .createQueryBuilder('existing')
            .leftJoin('sys_org', 'org', 'existing.org_id = org.id')
            .select([
                'existing.id',
                'existing.code',
                'existing.reserve_id',
                'existing.org_id',
                'existing.org_code',
                'existing.fin_name',
                'existing.funding_structure',
                'existing.funding_mode',
                'existing.institution_type',
                'existing.financial_institution_id',
                'existing.financial_institution_name',
                'existing.funding_amount',
                'existing.disbursement_amount',
                'existing.return_interest_rate',
                'existing.repayment_period',
                'existing.repayment_method',
                'existing.interest_type',
                'existing.loan_prime_rate',
                'existing.basis_point',
                'existing.days_count_basis',
                'existing.include_settlement_date',
                'existing.repayment_delay_days',
                'existing.loan_renewal_from_id',
                'existing.is_multiple',
                'existing.fin_term',
                'existing.maturity_date',
                'existing.is_public',
                'existing.create_time',
                'existing.create_by',
                'existing.update_time',
                'existing.update_by',
                'org.name as org_name'
            ])
            .where('existing.id = :id', { id })
            .andWhere('existing.is_deleted = :isDeleted', { isDeleted: false });

        const result = await queryBuilder.getRawOne();

        if (!result) {
            throw new RaxBizException(`存量融资不存在: ${id}`);
        }

        const responseDto = this.convertToResponseDto(result);
        this.logger.info(this.CONTEXT, `查询存量融资详情成功: ID=${id}`);
        return responseDto;
    }

    /**
     * 分页查询存量融资
     * @param queryDto 查询条件
     * @returns 分页结果
     */
    async findPage(queryDto: QueryFinExistingDto): Promise<PageResult<FinExistingListItemDto>> {
        this.logger.info(this.CONTEXT, `分页查询存量融资开始: ${JSON.stringify(queryDto)}`);
        
        const { pageNo = 1, pageSize = 10, ...conditions } = queryDto;
        
        const queryBuilder = this.finExistingRepository
            .createQueryBuilder('existing')
            .leftJoin('sys_org', 'org', 'existing.org_id = org.id')
            .select([
                'existing.id',
                'existing.code',
                'existing.org_id',
                'existing.funding_mode',
                'existing.financial_institution_name',
                'existing.funding_amount',
                'existing.disbursement_amount',
                'existing.fin_term',
                'existing.create_time',
                'org.name as org_name'
            ])
            .where('existing.is_deleted = :isDeleted', { isDeleted: false });

        // 添加查询条件
        this.buildQueryConditions(queryBuilder, conditions);

        // 排序
        queryBuilder.orderBy('existing.create_time', 'DESC');

        // 分页
        const skip = (pageNo - 1) * pageSize;
        queryBuilder.skip(skip).take(pageSize);

        const totalQuery = queryBuilder.clone();
        const results = await queryBuilder.getRawMany();
        const total = await totalQuery.getCount();
        const rows = results.map(result => this.convertToListItemDto(result));

        const pageResult = PageResult.of<FinExistingListItemDto>(pageNo, pageSize, total, rows);
        this.logger.info(this.CONTEXT, `分页查询存量融资成功: 总数=${total}`);
        return pageResult;
    }

    /**
     * 验证业务规则
     */
    private async validateBusinessRules(createDto: CreateFinExistingDto, queryRunner: any): Promise<void> {
        const fundingAmountInYuan = this.convertAmountToYuan(createDto.fundingAmount);

        // 验证放款记录的金额总和不能超过融资总额
        if (createDto.disbursements && createDto.disbursements.length > 0) {
            const totalDisbursementAmount = createDto.disbursements.reduce((sum, d) => {
                return sum + this.convertAmountToYuan(d.amount);
            }, 0);

            if (totalDisbursementAmount > fundingAmountInYuan) {
                throw new RaxBizException('放款记录的金额总和不能超过融资总额');
            }
        }

        // 验证勾稽关系的金额总和不能超过融资总额
        if (createDto.linkages && createDto.linkages.length > 0) {
            const totalLinkageAmount = createDto.linkages.reduce((sum, l) => {
                return sum + this.convertAmountToYuan(l.linkageAmount);
            }, 0);

            if (totalLinkageAmount > fundingAmountInYuan) {
                throw new RaxBizException('勾稽关系的金额总和不能超过融资总额');
            }
        }
    }

    /**
     * 创建放款记录
     */
    private async createDisbursements(existingId: number, disbursements: any[], queryRunner: any): Promise<FinExistingDisbursement[]> {
        const savedDisbursements: FinExistingDisbursement[] = [];

        for (const disbursementDto of disbursements) {
            const disbursement = queryRunner.manager.create(FinExistingDisbursement, {
                id: this.snowflake.nextId(),
                existingId,
                amount: this.convertAmountToYuan(disbursementDto.amount),
                ...disbursementDto,
                isDeleted: false,
                createBy: this.userContext.getUsername()!,
                createTime: new Date()
            });

            const saved = await queryRunner.manager.save(disbursement);
            savedDisbursements.push(saved);
        }

        return savedDisbursements;
    }

    /**
     * 创建担保记录
     */
    private async createGuarantees(existingId: number, guarantees: any[], queryRunner: any): Promise<void> {
        for (const guaranteeDto of guarantees) {
            const guaranteeId = this.snowflake.nextId();
            
            const guarantee = queryRunner.manager.create(FinExistingGuarantee, {
                id: guaranteeId,
                existingId,
                guaranteeBonus: guaranteeDto.guaranteeBonus ? this.convertAmountToYuan(guaranteeDto.guaranteeBonus) : null,
                ...guaranteeDto,
                isDeleted: false,
                createBy: this.userContext.getUsername()!,
                createTime: new Date()
            });

            await queryRunner.manager.save(guarantee);

            // 创建担保物关联关系
            if (guaranteeDto.assetIds && guaranteeDto.assetIds.length > 0) {
                for (const assetId of guaranteeDto.assetIds) {
                    const guaranteeAsset = queryRunner.manager.create(FinExistingGuaranteeAsset, {
                        id: this.snowflake.nextId(),
                        guaranteeId,
                        assetId,
                        isDeleted: false,
                        createBy: this.userContext.getUsername()!,
                        createTime: new Date()
                    });

                    await queryRunner.manager.save(guaranteeAsset);
                }
            }

            // 创建反担保记录
            if (guaranteeDto.counterGuarantees && guaranteeDto.counterGuarantees.length > 0) {
                for (const counterGuaranteeDto of guaranteeDto.counterGuarantees) {
                    const counterGuarantee = queryRunner.manager.create(FinExistingGuarantee, {
                        id: this.snowflake.nextId(),
                        existingId,
                        counterGuaranteeId: guaranteeId,
                        guaranteeBonus: counterGuaranteeDto.guaranteeBonus ? this.convertAmountToYuan(counterGuaranteeDto.guaranteeBonus) : null,
                        ...counterGuaranteeDto,
                        isDeleted: false,
                        createBy: this.userContext.getUsername()!,
                        createTime: new Date()
                    });

                    await queryRunner.manager.save(counterGuarantee);
                }
            }
        }
    }

    /**
     * 创建勾稽关系
     */
    private async createLinkages(existingId: number, linkages: any[], queryRunner: any): Promise<void> {
        for (const linkageDto of linkages) {
            const linkage = queryRunner.manager.create(FinExistingLinkage, {
                id: this.snowflake.nextId(),
                existingId,
                linkageAmount: this.convertAmountToYuan(linkageDto.linkageAmount),
                ...linkageDto,
                isDeleted: false,
                createBy: this.userContext.getUsername()!,
                createTime: new Date()
            });

            await queryRunner.manager.save(linkage);
        }
    }

    /**
     * 构建查询条件
     */
    private buildQueryConditions(queryBuilder: any, conditions: any): void {
        if (conditions.orgId) {
            queryBuilder.andWhere('existing.org_id = :orgId', { orgId: conditions.orgId });
        }
        if (conditions.fundingMode) {
            queryBuilder.andWhere('existing.funding_mode = :fundingMode', { fundingMode: conditions.fundingMode });
        }
        if (conditions.institutionType) {
            queryBuilder.andWhere('existing.institution_type = :institutionType', { institutionType: conditions.institutionType });
        }
        if (conditions.financialInstitutionName) {
            queryBuilder.andWhere('existing.financial_institution_name LIKE :financialInstitutionName', { 
                financialInstitutionName: `%${conditions.financialInstitutionName}%` 
            });
        }
        if (conditions.fundingAmountMin) {
            const minAmount = this.convertAmountToYuan(conditions.fundingAmountMin);
            queryBuilder.andWhere('existing.funding_amount >= :minAmount', { minAmount });
        }
        if (conditions.fundingAmountMax) {
            const maxAmount = this.convertAmountToYuan(conditions.fundingAmountMax);
            queryBuilder.andWhere('existing.funding_amount <= :maxAmount', { maxAmount });
        }
        if (conditions.returnInterestRateMin !== undefined) {
            queryBuilder.andWhere('existing.return_interest_rate >= :minRate', { minRate: conditions.returnInterestRateMin });
        }
        if (conditions.returnInterestRateMax !== undefined) {
            queryBuilder.andWhere('existing.return_interest_rate <= :maxRate', { maxRate: conditions.returnInterestRateMax });
        }
        if (conditions.repaymentPeriod) {
            queryBuilder.andWhere('existing.repayment_period = :repaymentPeriod', { repaymentPeriod: conditions.repaymentPeriod });
        }
        if (conditions.repaymentMethod) {
            queryBuilder.andWhere('existing.repayment_method = :repaymentMethod', { repaymentMethod: conditions.repaymentMethod });
        }
        if (conditions.interestType) {
            queryBuilder.andWhere('existing.interest_type = :interestType', { interestType: conditions.interestType });
        }
        if (conditions.isMultiple !== undefined) {
            queryBuilder.andWhere('existing.is_multiple = :isMultiple', { isMultiple: conditions.isMultiple });
        }
        if (conditions.finTermMin) {
            queryBuilder.andWhere('existing.fin_term >= :finTermMin', { finTermMin: conditions.finTermMin });
        }
        if (conditions.finTermMax) {
            queryBuilder.andWhere('existing.fin_term <= :finTermMax', { finTermMax: conditions.finTermMax });
        }
        if (conditions.maturityDateStart) {
            queryBuilder.andWhere('existing.maturity_date >= :maturityDateStart', { maturityDateStart: conditions.maturityDateStart });
        }
        if (conditions.maturityDateEnd) {
            queryBuilder.andWhere('existing.maturity_date <= :maturityDateEnd', { maturityDateEnd: conditions.maturityDateEnd });
        }
        if (conditions.isPublic !== undefined) {
            queryBuilder.andWhere('existing.is_public = :isPublic', { isPublic: conditions.isPublic });
        }
    }

    /**
     * 转换为响应DTO
     */
    private convertToResponseDto(raw: any): FinExistingResponseDto {
        const dto = new FinExistingResponseDto();
        dto.id = raw.existing_id?.toString() || '';
        dto.code = raw.existing_code || '';
        dto.reserveId = raw.existing_reserve_id?.toString() || '0';
        dto.orgId = raw.existing_org_id?.toString() || '';
        dto.orgCode = raw.existing_org_code || '';
        dto.orgName = raw.org_name || '';
        dto.finName = raw.existing_fin_name || '';
        dto.fundingStructure = raw.existing_funding_structure || '';
        dto.fundingMode = raw.existing_funding_mode || '';
        dto.institutionType = raw.existing_institution_type;
        dto.financialInstitutionId = raw.existing_financial_institution_id?.toString() || '';
        dto.financialInstitutionName = raw.existing_financial_institution_name || '';
        dto.fundingAmount = raw.existing_funding_amount?.toString() || '0';
        dto.disbursementAmount = raw.existing_disbursement_amount?.toString() || '0';
        dto.returnInterestRate = raw.existing_return_interest_rate || 0;
        dto.repaymentPeriod = raw.existing_repayment_period;
        dto.repaymentMethod = raw.existing_repayment_method;
        dto.interestType = raw.existing_interest_type;
        dto.loanPrimeRate = raw.existing_loan_prime_rate || 0;
        dto.basisPoint = raw.existing_basis_point || 0;
        dto.daysCountBasis = raw.existing_days_count_basis;
        dto.includeSettlementDate = raw.existing_include_settlement_date || false;
        dto.repaymentDelayDays = raw.existing_repayment_delay_days || 0;
        dto.loanRenewalFromId = raw.existing_loan_renewal_from_id?.toString() || '0';
        dto.isMultiple = raw.existing_is_multiple || false;
        dto.finTerm = raw.existing_fin_term || 0;
        dto.maturityDate = raw.existing_maturity_date;
        dto.isPublic = raw.existing_is_public || true;
        dto.createTime = raw.existing_create_time;
        dto.createBy = raw.existing_create_by || '';
        dto.updateTime = raw.existing_update_time;
        dto.updateBy = raw.existing_update_by || '';
        return dto;
    }

    /**
     * 转换为列表项DTO
     */
    private convertToListItemDto(raw: any): FinExistingListItemDto {
        const dto = new FinExistingListItemDto();
        dto.id = raw.existing_id?.toString() || '';
        dto.code = raw.existing_code || '';
        dto.orgId = raw.existing_org_id?.toString() || '';
        dto.orgName = raw.org_name || '';
        dto.fundingMode = raw.existing_funding_mode || '';
        dto.financialInstitutionName = raw.existing_financial_institution_name || '';
        dto.fundingAmount = raw.existing_funding_amount?.toString() || '0';
        dto.disbursementAmount = raw.existing_disbursement_amount?.toString() || '0';
        dto.finTerm = raw.existing_fin_term || 0;
        dto.createTime = raw.existing_create_time;
        return dto;
    }

    /**
     * 将万元金额转换为分
     */
    private convertAmountToYuan(amountStr: string): number {
        return Math.round(parseFloat(amountStr) * 1000000);
    }
} 