import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { AssetFixed } from '../../entities/assetFixed.entity';
import { SysOrg } from '../../entities/sysOrg.entity';
import { CreateAssetFixedDto } from './dto/create-asset-fixed.dto';
import { UpdateAssetFixedDto } from './dto/update-asset-fixed.dto';
import { QueryAssetFixedDto } from './dto/query-asset-fixed.dto';
import { AssetFixedResponseDto } from './dto/asset-fixed-response.dto';
import { PageResult } from '../../common/entities/page.entity';
import { RaxBizException } from '../../common/exceptions/rax-biz.exception';
import { SNOWFLAKE } from '../../common/providers';
import { Snowflake } from '../../common/utils/snowflake';
import { UserContext } from '../../common/context/user-context';
import { LoggerService } from '../../common/logger/logger.service';

@Injectable()
export class AssetFixedService {
    private readonly CONTEXT = 'AssetFixedService';

    constructor(
        @InjectRepository(AssetFixed)
        private readonly assetFixedRepository: Repository<AssetFixed>,
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
     * 创建固定资产
     * @param createAssetFixedDto 创建固定资产的数据
     * @returns 创建的固定资产
     * @throws {RaxBizException} 业务异常
     */
    async create(createAssetFixedDto: CreateAssetFixedDto): Promise<AssetFixed> {
        this.logger.info(this.CONTEXT, `创建固定资产开始: ${JSON.stringify(createAssetFixedDto)}`);
        
        // 创建固定资产对象
        const assetFixed = this.assetFixedRepository.create({
            id: this.snowflake.nextId(),
            ...createAssetFixedDto,
            isDeleted: false,
            createBy: this.userContext.getUsername()!,
            createTime: new Date(),
        });

        try {
            const savedAssetFixed = await this.assetFixedRepository.save(assetFixed);
            this.logger.info(this.CONTEXT, `创建固定资产成功: ID=${savedAssetFixed.id}`);
            return savedAssetFixed;
        } catch (error) {
            this.logger.error(this.CONTEXT, error, `创建固定资产失败: ${JSON.stringify(createAssetFixedDto)}`);
            throw error;
        }
    }

    /**
     * 更新固定资产
     * @param updateAssetFixedDto 更新固定资产的数据
     * @returns 更新后的固定资产
     * @throws {RaxBizException} 业务异常
     */
    async update(updateAssetFixedDto: UpdateAssetFixedDto): Promise<AssetFixed> {
        this.logger.info(this.CONTEXT, `更新固定资产开始: ${JSON.stringify(updateAssetFixedDto)}`);
        
        // 查询固定资产是否存在
        const assetFixed = await this.assetFixedRepository.findOne({
            where: { id: updateAssetFixedDto.id, isDeleted: false }
        });

        if (!assetFixed) {
            throw new RaxBizException(`固定资产不存在: ${updateAssetFixedDto.id}`);
        }

        try {
            // 更新固定资产信息（只更新提供的字段）
            Object.assign(assetFixed, {
                ...updateAssetFixedDto,
                updateBy: this.userContext.getUsername()!,
                updateTime: new Date()
            });

            const updatedAssetFixed = await this.assetFixedRepository.save(assetFixed);
            this.logger.info(this.CONTEXT, `更新固定资产成功: ID=${updatedAssetFixed.id}`);
            return updatedAssetFixed;
        } catch (error) {
            this.logger.error(this.CONTEXT, error, `更新固定资产失败: ${JSON.stringify(updateAssetFixedDto)}`);
            throw error;
        }
    }

    /**
     * 删除固定资产（软删除）
     * @param id 固定资产ID
     * @returns 删除是否成功
     * @throws {RaxBizException} 业务异常
     */
    async delete(id: number): Promise<boolean> {
        this.logger.info(this.CONTEXT, `删除固定资产开始: ID=${id}`);
        
        // 查询固定资产是否存在
        const assetFixed = await this.assetFixedRepository.findOne({
            where: { id, isDeleted: false }
        });

        if (!assetFixed) {
            throw new RaxBizException(`固定资产不存在: ${id}`);
        }

        try {
            assetFixed.isDeleted = true;
            assetFixed.updateBy = this.userContext.getUsername()!;
            assetFixed.updateTime = new Date();

            await this.assetFixedRepository.save(assetFixed);
            this.logger.info(this.CONTEXT, `删除固定资产成功: ID=${id}`);
            return true;
        } catch (error) {
            this.logger.error(this.CONTEXT, error, `删除固定资产失败: ID=${id}`);
            throw error;
        }
    }

    /**
     * 根据ID获取固定资产详情
     * @param id 固定资产ID
     * @returns 固定资产详情
     * @throws {RaxBizException} 业务异常
     */
    async findById(id: number): Promise<AssetFixedResponseDto> {
        this.logger.info(this.CONTEXT, `查询固定资产详情: ID=${id}`);
        
        const queryBuilder = this.assetFixedRepository
            .createQueryBuilder('asset')
            .leftJoinAndSelect('sys_org', 'org', 'asset.org_id = org.id')
            .select([
                'asset.id',
                'asset.name',
                'asset.org_id',
                'asset.is_deleted',
                'asset.create_time',
                'asset.create_by',
                'asset.update_time',
                'asset.update_by',
                'org.name',
                'org.name_abbr'
            ])
            .where('asset.id = :id', { id })
            .andWhere('asset.is_deleted = :isDeleted', { isDeleted: false });

        const result = await queryBuilder.getRawOne();

        if (!result) {
            throw new RaxBizException(`固定资产不存在: ${id}`);
        }

        const responseDto = this.convertToResponseDto(result);
        this.logger.info(this.CONTEXT, `查询固定资产详情成功: ID=${id}`);
        return responseDto;
    }

    /**
     * 分页查询固定资产
     * @param queryDto 查询条件
     * @returns 分页结果
     */
    async findPage(queryDto: QueryAssetFixedDto): Promise<PageResult<AssetFixedResponseDto>> {
        this.logger.info(this.CONTEXT, `分页查询固定资产开始: ${JSON.stringify(queryDto)}`);
        
        const { pageNo = 1, pageSize = 10, ...conditions } = queryDto;
        
        const queryBuilder = this.assetFixedRepository
            .createQueryBuilder('asset')
            .leftJoinAndSelect('sys_org', 'org', 'asset.org_id = org.id')
            .select([
                'asset.id',
                'asset.name',
                'asset.org_id',
                'asset.is_deleted',
                'asset.create_time',
                'asset.create_by',
                'asset.update_time',
                'asset.update_by',
                'org.name',
                'org.name_abbr'
            ])
            .where('asset.is_deleted = :isDeleted', { isDeleted: false });

        // 添加查询条件
        if (conditions.name) {
            queryBuilder.andWhere('asset.name LIKE :name', { name: `%${conditions.name}%` });
        }
        if (conditions.orgId) {
            queryBuilder.andWhere('asset.org_id = :orgId', { orgId: conditions.orgId });
        }

        // 获取总数
        const total = await queryBuilder.getCount();
        
        // 分页和排序
        const rawResults = await queryBuilder
            .orderBy('asset.create_time', 'DESC')
            .skip((pageNo - 1) * pageSize)
            .take(pageSize)
            .getRawMany();

        // 转换为响应DTO
        const assetFixedList = rawResults.map(raw => this.convertToResponseDto(raw));

        const result = PageResult.of(pageNo, pageSize, total, assetFixedList);
        this.logger.info(this.CONTEXT, `分页查询固定资产成功: 总数=${total}, 当前页=${pageNo}`);
        return result;
    }

    /**
     * 转换查询结果为响应DTO
     * @param raw 原始查询结果
     * @returns 响应DTO
     */
    private convertToResponseDto(raw: any): AssetFixedResponseDto {
        const dto = new AssetFixedResponseDto();
        dto.id = raw.asset_id;
        dto.name = raw.asset_name;
        dto.orgId = raw.org_id;
        dto.orgName = raw.org_name || '';
        dto.orgNameAbbr = raw.name_abbr || '';
        dto.isDeleted = Boolean(raw.is_deleted);
        dto.createTime = raw.create_time;
        dto.createBy = raw.create_by;
        dto.updateTime = raw.update_time;
        dto.updateBy = raw.update_by;
        return dto;
    }
} 