import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, Like } from 'typeorm';
import { SysOrg } from '../../entities/sysOrg.entity';
import { RaxBizException } from '../../common/exceptions/rax-biz.exception';
import { CreateOrgDto } from './dto/create-org.dto';
import { UpdateOrgDto } from './dto/update-org.dto';
import { OrgTreeDto } from './dto/org-tree.dto';
import { SNOWFLAKE } from '../../common/providers';
import { Snowflake } from '../../common/utils/snowflake';
import { UserContext } from '../../common/context/user-context';

@Injectable()
export class SysOrgService {
    constructor(
        @InjectRepository(SysOrg)
        private readonly sysOrgRepository: Repository<SysOrg>,
        @Inject(SNOWFLAKE)
        private readonly snowflake: Snowflake,
        private readonly dataSource: DataSource,
        @Inject('UserContext')
        private readonly userContext: UserContext
    ) {}

    /**
     * 生成组织编码
     *  组织编码规则：
     *  1. 组织编码每4位数为一级，每一级从 0001 开始，顺序编号
     *  2. 例如：0001 表示一级组织，00010001 表示二级组织，000100010001 表示三级组织，0001000100010001 表示四级组织
     *  组织编码生成规则：
     *  1. 如果 parentId 为空，则抛出异常
     *  2. 如果 parentId 不为 0, 则检查父组织是否存在，不存在则抛出异常
     *  3. 如果父组织存在，查找已有子组织的最大编码
     *  4. 如果最大编码为空，则直接返回父组织编码 + '0001'
     *  5. 如果最大编码不为空，则将最大编码的最后一位加 1
     *  6. 返回组织编码
     * @param parentId 父级组织 ID
     * @returns 组织编码
     */
    async generateOrgCode(parentId: number): Promise<string> {
        // 1. 验证 parentId 是否为空
        if (parentId === undefined || parentId === null) {
            throw new RaxBizException('父级组织ID不能为空');
        }

        // 2. 如果 parentId 不为 0，检查父组织是否存在
        if (parentId !== 0) {
            const parentOrg = await this.sysOrgRepository.findOne({
                where: { id: parentId }
            });
            if (!parentOrg) {
                throw new RaxBizException(`父级组织不存在: ${parentId}`);
            }
        }

        // 3. 查找已有子组织的最大编码
        const maxOrg = await this.sysOrgRepository
            .createQueryBuilder('org')
            .where('org.parent_id = :parentId', { parentId })
            .orderBy('org.code', 'DESC')
            .getOne();

        // 4. 生成新的组织编码
        if (!maxOrg) {
            if (parentId === 0) {
                // 一级组织，直接返回 0001
                return '0001';
            } else {
                // 非一级组织，返回父组织编码 + 0001
                const parentOrg = await this.sysOrgRepository.findOne({
                    where: { id: parentId }
                });
                if (!parentOrg) {
                    throw new RaxBizException(`父级组织不存在: ${parentId}`);
                }
                return `${parentOrg.code}0001`;
            }
        }

        // 5. 如果存在最大编码，将最后4位加1
        const lastFourDigits = maxOrg.code.slice(-4);
        const nextNumber = (parseInt(lastFourDigits) + 1).toString().padStart(4, '0');
        return maxOrg.code.slice(0, -4) + nextNumber;
    }

    /**
     * 重新计算子孙组织编码
     * 1. 使用 oldParentCode 查询所有子孙组织
     * 2. 使用 newParentCode 替换所有子孙组织的父级组织编码
     * 3. 设置子孙组织的 updateBy 为当前用户
     * 4. 设置子孙组织的 updateTime 为当前时间
     * 5. 返回重新计算编码后的组织
     * @param oldParentCode 旧的父级组织编码
     * @param newParentCode 新的父级组织编码
     * @returns 重新计算编码后的组织
     */
    async reCalculateDescendantOrgCode(oldParentCode: string, newParentCode: string): Promise<SysOrg[]> {
        // 1. 使用 oldParentCode 查询所有子孙组织
        const descendantOrgs = await this.sysOrgRepository.find({
            where: { code: Like(`${oldParentCode}%`) }
        });

        // 2. 使用 newParentCode 替换所有子孙组织的父级组织编码
        for (const org of descendantOrgs) {
            org.code = org.code.replace(oldParentCode, newParentCode);
        }

        // 3. 设置子孙组织的 updateBy 为当前用户
        for (const org of descendantOrgs) {
            org.updateBy = this.userContext.getUsername()!;
            org.updateTime = new Date();
        }
        return descendantOrgs;
    }

    /**
     * 创建组织
     * @param createOrgDto 创建组织的数据
     * @returns 创建的组织
     */
    async create(createOrgDto: CreateOrgDto): Promise<SysOrg> {
        // 1. 验证父组织是否存在
        if (createOrgDto.parentId !== 0) {
            const parentOrg = await this.sysOrgRepository.findOne({
                where: { id: createOrgDto.parentId }
            });
            if (!parentOrg) {
                throw new RaxBizException(`父级组织不存在: ${createOrgDto.parentId}`);
            }
        }

        // 2. 生成组织编码
        const code = await this.generateOrgCode(createOrgDto.parentId);

        // 3. 创建组织对象
        const org = this.sysOrgRepository.create({
            id: this.snowflake.nextId(),
            code,
            ...createOrgDto,
            createBy: this.userContext.getUsername()!,
            createTime: new Date(),
        });

        // 4. 使用事务保存组织
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const savedOrg = await queryRunner.manager.save(org);
            await queryRunner.commitTransaction();
            return savedOrg;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    /**
     * 更新组织
     * 1. 使用组织ID查询组织
     * 2. 如果组织不存在，则抛出异常
     * 3. 如果组织存在，判断新旧父组织是否一致
     * 4. 如果新旧父组织一致，则直接更新组织（为空的字段不更新）
     * 5. 如果新旧父组织不一致
     *  5.1 如果新的父组织不是 0，则检查变更后的层级关系是否合规
     *      5.1.1 新的父组织不能是自己
     *      5.1.2 新的父组织不能是自己的子孙组织
     * 6. 根据新的父组织 ID，生成当前组织的新编码并赋值
     * 7. 根据当前组织的新旧编码，重新计算子孙组织编码
     * 8. 使用事务更新组织及其子孙组织
     * 9. 如果全部流程都正常，则返回 true，否则返回 false
     * @param updateOrgDto 更新组织的数据
     * @returns 更新是否成功
     */
    async update(updateOrgDto: UpdateOrgDto): Promise<boolean> {
        // 1. 使用组织ID查询组织
        const org = await this.sysOrgRepository.findOne({
            where: { id: updateOrgDto.id }
        });

        // 2. 如果组织不存在，则抛出异常
        if (!org) {
            throw new RaxBizException(`组织不存在: ${updateOrgDto.id}`);
        }

        // 3. 判断新旧父组织是否一致
        const isParentChanged = org.parentId !== updateOrgDto.parentId;

        let updatedDescendants: SysOrg[] = [];
        let newCode = org.code;

        // 4 & 5. 处理父组织变更
        if (isParentChanged) {
            if (updateOrgDto.parentId !== 0) {
                // 5.1 检查新的父组织是否存在
                const newParentOrg = await this.sysOrgRepository.findOne({
                    where: { id: updateOrgDto.parentId }
                });
                if (!newParentOrg) {
                    throw new RaxBizException(`父级组织不存在: ${updateOrgDto.parentId}`);
                }

                // 5.1.1 新的父组织不能是自己
                if (newParentOrg.id === org.id) {
                    throw new RaxBizException('不能将自己设置为父级组织');
                }

                // 5.1.2 新的父组织不能是自己的子孙组织（通过编码前缀判断）
                if (newParentOrg.code.startsWith(org.code)) {
                    throw new RaxBizException('不能将子孙组织设置为父级组织');
                }
            }

            // 6. 生成新的组织编码
            newCode = await this.generateOrgCode(updateOrgDto.parentId);

            // 7. 重新计算子孙组织编码
            updatedDescendants = await this.reCalculateDescendantOrgCode(org.code, newCode);
        }

        // 8. 使用事务更新组织及其子孙组织
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            // 更新当前组织
            const updateData: Partial<SysOrg> = {
                name: updateOrgDto.name || org.name,
                nameAbbr: updateOrgDto.nameAbbr || org.nameAbbr,
                comment: updateOrgDto.comment !== undefined ? updateOrgDto.comment : org.comment,
                updateBy: this.userContext.getUsername()!,
                updateTime: new Date()
            };

            if (isParentChanged) {
                updateData.parentId = updateOrgDto.parentId;
                updateData.code = newCode;
            }

            await queryRunner.manager.update(SysOrg, updateOrgDto.id, updateData);

            // 如果父组织变更，更新子孙组织
            if (isParentChanged && updatedDescendants.length > 0) {
                for (const descendant of updatedDescendants) {
                    await queryRunner.manager.update(
                        SysOrg,
                        { id: descendant.id },
                        {
                            code: descendant.code,
                            updateBy: this.userContext.getUsername()!,
                            updateTime: new Date()
                        }
                    );
                }
            }

            await queryRunner.commitTransaction();
            return true;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    /**
     * 删除组织
     * 1. 检查组织是否存在
     * 2. 检查组织是否存在子组织
     * 3. 如果组织存在子组织，则抛出异常
     * 4. 如果组织不存在子组织，则删除组织
     * 5. 返回删除是否成功
     * @param id 组织ID
     * @returns 删除是否成功
     */
    async delete(id: number): Promise<boolean> {
        // 1. 检查组织是否存在
        const org = await this.sysOrgRepository.findOne({
            where: { id }
        });
        if (!org) {
            throw new RaxBizException(`组织不存在: ${id}`);
        }

        // 2. 检查组织是否存在子组织
        const hasChildren = await this.sysOrgRepository.exists({
            where: { parentId: id }
        }); 
        if (hasChildren) {
            throw new RaxBizException('组织存在子组织，不能删除');
        }

        // 3. 删除组织
        await this.sysOrgRepository.delete(id);
        return true;
    }

    /**
     * 获取组织树
     * 1. 根据组织ID查询组织
     * 2. 如果组织不存在，则抛出异常
     * 3. 根据组织编码长度判断组织层级
     * 4. 获取该组织的所有上级组织
     * 5. 获取该组织的所有下级组织
     * 6. 构建组织树
     * @param id 组织ID
     * @returns 组织树
     */
    async getOrgTree(id: number): Promise<OrgTreeDto> {
        // 1. 查询当前组织
        const currentOrg = await this.sysOrgRepository.findOne({
            where: { id }
        });
        if (!currentOrg) {
            throw new RaxBizException(`组织不存在: ${id}`);
        }

        // 2. 获取所有相关组织
        const ancestorCodes = this.getAncestorCodes(currentOrg.code);
        const queryBuilder = this.sysOrgRepository
            .createQueryBuilder('org')
            .where('org.code LIKE :ancestorCode', { ancestorCode: currentOrg.code.substring(0, 4) + '%' }); // 获取根组织及其所有子孙

        // 只有当有祖先编码时才添加 OR 条件
        if (ancestorCodes.length > 0) {
            queryBuilder.orWhere('org.code IN (:...ancestorCodes)', { ancestorCodes });
        }

        const allOrgs = await queryBuilder
            .orderBy('org.code', 'ASC')
            .getMany();

        // 3. 构建组织树
        const orgMap = new Map<number, OrgTreeDto>();
        let rootOrg: OrgTreeDto | undefined;

        // 3.1 先将所有组织转换为 OrgTreeDto 并存入 Map
        allOrgs.forEach(org => {
            orgMap.set(org.id, new OrgTreeDto(org));
        });

        // 3.2 建立父子关系
        orgMap.forEach(org => {
            if (org.parentId === 0) {
                rootOrg = org;
            } else {
                const parentOrg = orgMap.get(org.parentId);
                if (parentOrg) {
                    if (!parentOrg.children) {
                        parentOrg.children = [];
                    }
                    parentOrg.children.push(org);
                }
            }
        });

        if (!rootOrg) {
            throw new RaxBizException('未找到根组织');
        }

        return rootOrg;
    }

    /**
     * 获取组织的所有祖先编码
     * @param code 组织编码
     * @returns 祖先编码数组
     */
    private getAncestorCodes(code: string): string[] {
        const ancestorCodes: string[] = [];
        const codeLength = code.length;
        
        // 组织编码每4位代表一级，从顶级开始获取每一级的编码
        for (let i = 4; i < codeLength; i += 4) {
            ancestorCodes.push(code.substring(0, i));
        }

        return ancestorCodes;
    }

    /**
     * 根据组织ID获取组织
     * @param id 组织ID
     * @returns 组织
     */
    async getOrgById(id: number): Promise<SysOrg> {
        const org = await this.sysOrgRepository.findOne({
            where: { id }
        });
        if (!org) {
            throw new RaxBizException(`组织不存在: ${id}`);
        }
        return org;
    }

    /**
     * 获取所有组织树
     * 1. 获取所有组织数据
     * 2. 将组织数据转换为树形结构
     * 3. 返回所有顶级组织及其子组织树
     * @returns 组织树数组
     */
    async getOrgTrees(): Promise<OrgTreeDto[]> {
        // 1. 先获取所有顶级组织
        const rootOrgs = await this.sysOrgRepository
            .createQueryBuilder('org')
            .where('org.parent_id = :parentId', { parentId: '0' })
            .orderBy('org.code', 'ASC')
            .getMany();

        if (rootOrgs.length === 0) {
            return [];
        }

        // 2. 获取所有组织的完整树
        const result: OrgTreeDto[] = [];
        for (const rootOrg of rootOrgs) {
            const tree = await this.getOrgTree(rootOrg.id);
            result.push(tree);
        }

        return result;
    }
} 