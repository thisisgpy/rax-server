import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, In } from 'typeorm';
import { SysUserRole } from '../../entities/sysUserRole.entity';
import { SysRoleResource } from '../../entities/sysRoleResource.entity';
import { SysResource } from '../../entities/sysResource.entity';
import { AssignUserRoleDto } from './dto/assign-user-role.dto';
import { RaxBizException } from '../../common/exceptions/rax-biz.exception';
import { SNOWFLAKE } from '../../common/providers';
import { Snowflake } from '../../common/utils/snowflake';
import { SysRole } from 'src/entities/sysRole.entity';
import { MenuListType } from './dto/menu-list.dto';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';

@Injectable()
export class PermissionService {
    constructor(
        @InjectRepository(SysUserRole)
        private readonly userRoleRepository: Repository<SysUserRole>,
        @InjectRepository(SysRoleResource)
        private readonly roleResourceRepository: Repository<SysRoleResource>,
        @InjectRepository(SysRole)
        private readonly roleRepository: Repository<SysRole>,
        @InjectRepository(SysResource)
        private readonly resourceRepository: Repository<SysResource>,
        @Inject(SNOWFLAKE)
        private readonly snowflake: Snowflake,
        private readonly dataSource: DataSource
    ) {}

    /**
     * 分配用户角色
     */
    async assignUserRoles(assignDto: AssignUserRoleDto): Promise<boolean> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            // 1. 删除用户现有的角色关系
            await queryRunner.manager.delete(SysUserRole, { userId: assignDto.userId });
            // 如果角色ID列表为空，表示清空用户角色，直接返回true
            if (assignDto.roleIds.length === 0) {
                await queryRunner.commitTransaction();
                return true;
            }
            // 2. 创建新的角色关系
            const userRoles = assignDto.roleIds.map(roleId => ({
                id: this.snowflake.nextId(),
                userId: assignDto.userId,
                roleId
            }));

            await queryRunner.manager.save(SysUserRole, userRoles);
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
     * 分配角色资源权限
     */
    async assignRoleResources(roleId: number, resourceIds: number[]): Promise<boolean> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            // 1. 删除角色现有的资源权限
            await queryRunner.manager.delete(SysRoleResource, { roleId });

            // 2. 创建新的资源权限关系
            const roleResources = resourceIds.map(resourceId => ({
                id: this.snowflake.nextId(),
                roleId,
                resourceId
            }));

            await queryRunner.manager.save(SysRoleResource, roleResources);
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
     * 获取用户的所有权限资源编码
     */
    async getUserPermissions(userId: number): Promise<string[]> {
        const query = `
            SELECT DISTINCT r.code
            FROM sys_resource r
            INNER JOIN sys_role_resource rr ON r.id = rr.resource_id
            INNER JOIN sys_user_role ur ON rr.role_id = ur.role_id
            WHERE ur.user_id = ? AND r.is_deleted = 0
        `;
        
        const result = await this.dataSource.query(query, [userId]);
        return result.map((row: any) => row.code);
    }

    /**
     * 检查用户是否有特定权限
     */
    async hasPermission(userId: number, resourceCode: string): Promise<boolean> {
        const permissions = await this.getUserPermissions(userId);
        return permissions.includes(resourceCode);
    }

    /**
     * 获取用户的角色列表
     */
    async getUserRoles(userId: number): Promise<SysRole[]> {
        const userRoles = await this.userRoleRepository.find({
            where: { userId }
        });
        const roleIds = userRoles.map(ur => ur.roleId);
        return await this.roleRepository.find({
            where: { id: In(roleIds) }
        });
    }

    /**
     * 获取角色的资源权限列表
     */
    async getRoleResources(roleId: number): Promise<number[]> {
        const roleResources = await this.roleResourceRepository.find({
            where: { roleId },
            select: ['resourceId']
        });
        return roleResources.map(rr => rr.resourceId);
    }

    /**
     * 获取用户的菜单权限（用于前端菜单构建）
     */
    async getUserMenus(userId: number): Promise<MenuListType[]> {
        // 1. 获取用户的所有资源权限（目录、菜单、按钮）
        const query = `
            SELECT DISTINCT r.*
            FROM sys_resource r
            INNER JOIN sys_role_resource rr ON r.id = rr.resource_id
            INNER JOIN sys_user_role ur ON rr.role_id = ur.role_id
            WHERE ur.user_id = ? 
              AND r.is_deleted = 0
            ORDER BY r.sort ASC, r.create_time ASC
        `;
        
        const allResources: SysResource[] = await this.dataSource.query(query, [userId]);
        
        // 2. 构建菜单树形结构
        return this.buildUserMenuTree(allResources);
    }

    /**
     * 构建用户菜单树形结构
     * 目录和菜单构成路由结构，按钮权限放入对应菜单的authList中
     */
    private buildUserMenuTree(resources: SysResource[]): MenuListType[] {
        // 分离目录/菜单和按钮
        const menuResources = resources.filter(r => r.type === 0 || r.type === 1); // 0:目录, 1:菜单
        const buttonResources = resources.filter(r => r.type === 2); // 2:按钮

        // 构建菜单资源映射
        const menuMap = new Map<number, MenuListType>();
        const rootMenus: MenuListType[] = [];

        // 转换目录和菜单为MenuListType格式
        menuResources.forEach(resource => {
            const menuItem: MenuListType = {
                id: resource.id,
                path: resource.path || '',
                name: resource.code, // 使用资源编码作为组件名称
                component: resource.component || undefined,
                meta: {
                    title: resource.name,
                    icon: resource.icon || undefined,
                    isHide: resource.isHidden || false,
                    keepAlive: resource.isKeepAlive || false,
                    authList: [] // 初始化为空数组，后续添加按钮权限
                }
            };
            menuMap.set(resource.id, menuItem);
        });

        // 将按钮权限添加到对应的菜单项中
        buttonResources.forEach(button => {
            const parentMenu = menuMap.get(button.parentId);
            if (parentMenu && parentMenu.meta.authList) {
                parentMenu.meta.authList.push(button.code);
            }
        });

        // 构建菜单树形结构
        menuResources.forEach(resource => {
            const menuItem = menuMap.get(resource.id)!;
            
            if (resource.parentId === 0) {
                // 根级菜单
                rootMenus.push(menuItem);
            } else {
                // 子菜单
                const parent = menuMap.get(resource.parentId);
                if (parent) {
                    if (!parent.children) {
                        parent.children = [];
                    }
                    parent.children.push(menuItem);
                }
            }
        });

        return rootMenus;
    }

    /**
     * 创建资源
     */
    async createResource(createResourceDto: CreateResourceDto): Promise<SysResource> {
        // 检查资源编码是否重复
        const existingResource = await this.resourceRepository.findOne({
            where: { code: createResourceDto.code, isDeleted: false }
        });
        if (existingResource) {
            throw new RaxBizException('资源编码已存在');
        }

        const resource = this.resourceRepository.create({
            id: this.snowflake.nextId(),
            ...createResourceDto,
            parentId: createResourceDto.parentId || 0,
            sort: createResourceDto.sort || 0,
            isHidden: createResourceDto.isHidden || false,
            isKeepAlive: createResourceDto.isKeepAlive || false,
            isExternalLink: createResourceDto.isExternalLink || false,
            isDeleted: false,
            createBy: 'system' // 实际应该从当前用户上下文获取
        });

        return await this.resourceRepository.save(resource);
    }

    /**
     * 更新资源
     */
    async updateResource(updateResourceDto: UpdateResourceDto): Promise<SysResource> {
        const resource = await this.resourceRepository.findOne({
            where: { id: updateResourceDto.id, isDeleted: false }
        });
        if (!resource) {
            throw new RaxBizException(`资源不存在: ${updateResourceDto.id}`);
        }

        // 如果更新资源编码，检查是否重复
        if (updateResourceDto.code && updateResourceDto.code !== resource.code) {
            const existingResource = await this.resourceRepository.findOne({
                where: { code: updateResourceDto.code, isDeleted: false }
            });
            if (existingResource) {
                throw new RaxBizException('资源编码已存在');
            }
        }

        const { id, ...updateData } = updateResourceDto;
        Object.assign(resource, {
            ...updateData,
            updateBy: 'system' // 实际应该从当前用户上下文获取
        });

        return await this.resourceRepository.save(resource);
    }

    /**
     * 删除资源（软删除）
     */
    async deleteResource(id: number): Promise<boolean> {
        const resource = await this.resourceRepository.findOne({
            where: { id, isDeleted: false }
        });
        if (!resource) {
            throw new RaxBizException(`资源不存在: ${id}`);
        }

        resource.isDeleted = true;
        resource.updateBy = 'system'; // 实际应该从当前用户上下文获取
        
        await this.resourceRepository.save(resource);
        return true;
    }

    /**
     * 根据ID获取资源
     */
    async findResourceById(id: number): Promise<SysResource> {
        const resource = await this.resourceRepository.findOne({
            where: { id, isDeleted: false }
        });
        if (!resource) {
            throw new RaxBizException(`资源不存在: ${id}`);
        }
        return resource;
    }

    /**
     * 根据父级ID查询子资源
     */
    async findChildrenResourcePage(parentId: number): Promise<SysResource[]> {
        const resources = await this.resourceRepository
            .createQueryBuilder('resource')
            .where('resource.is_deleted = :isDeleted', { isDeleted: false })
            .andWhere('resource.parent_id = :parentId', { parentId })
            .orderBy('resource.sort', 'ASC')
            .addOrderBy('resource.create_time', 'DESC')
            .getMany();

        return resources;
    }

    /**
     * 获取所有资源（树形结构）
     */
    async getAllResourcesTree(): Promise<SysResource[]> {
        const resources = await this.resourceRepository.find({
            where: { isDeleted: false },
            order: { sort: 'ASC', createTime: 'ASC' }
        });

        return this.buildResourceTree(resources);
    }

    /**
     * 构建资源树形结构
     */
    private buildResourceTree(resources: SysResource[]): SysResource[] {
        const resourceMap = new Map<number, SysResource & { children?: SysResource[] }>();
        const rootResources: (SysResource & { children?: SysResource[] })[] = [];

        // 构建资源映射
        resources.forEach(resource => {
            resourceMap.set(resource.id, { ...resource });
        });

        // 构建树形结构
        resources.forEach(resource => {
            const resourceItem = resourceMap.get(resource.id)!;
            
            if (resource.parentId === 0) {
                // 根级资源
                rootResources.push(resourceItem);
            } else {
                // 子资源
                const parent = resourceMap.get(resource.parentId);
                if (parent) {
                    if (!parent.children) {
                        parent.children = [];
                    }
                    parent.children.push(resourceItem);
                }
            }
        });

        return rootResources;
    }
} 