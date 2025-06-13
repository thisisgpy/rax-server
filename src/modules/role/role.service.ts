import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SysRole } from '../../entities/sysRole.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { RaxBizException } from '../../common/exceptions/rax-biz.exception';
import { SNOWFLAKE } from '../../common/providers';
import { Snowflake } from '../../common/utils/snowflake';
import { UpdateRoleDto } from './dto/update-role.dto';
import { QueryRoleDto } from './dto/query-role.dto';
import { PageResult } from 'src/common/entities/page.entity';

@Injectable()
export class RoleService {
    constructor(
        @InjectRepository(SysRole)
        private readonly roleRepository: Repository<SysRole>,
        @Inject(SNOWFLAKE)
        private readonly snowflake: Snowflake,
        @Inject('UserContext')
        private readonly userContext: any
    ) {}

    /**
     * 创建角色
     */
    async create(createRoleDto: CreateRoleDto): Promise<SysRole> {
        // 检查角色编码是否已存在
        const existingRole = await this.roleRepository.findOne({
            where: { code: createRoleDto.code, isDeleted: false }
        });
        if (existingRole) {
            throw new RaxBizException('角色编码已存在');
        }

        const role = this.roleRepository.create({
            id: this.snowflake.nextId(),
            ...createRoleDto,
            isDeleted: false,
            createBy: this.userContext.getUsername()!,
            createTime: new Date()
        });

        return await this.roleRepository.save(role);
    }

    /**
     * 根据ID获取角色
     */
    async findById(id: number): Promise<SysRole> {
        const role = await this.roleRepository.findOne({
            where: { id, isDeleted: false }
        });
        if (!role) {
            throw new RaxBizException(`角色不存在: ${id}`);
        }
        return role;
    }

    /**
     * 分页查询角色列表
     */
    async findPage(queryRoleDto: QueryRoleDto): Promise<PageResult<SysRole>> {
        const { pageNo = 1, pageSize = 10, name } = queryRoleDto;

        const queryBuilder = this.roleRepository
            .createQueryBuilder('role')
            .where('role.is_deleted = :isDeleted', { isDeleted: false });
        
        if (name) {
            queryBuilder.andWhere('role.name LIKE :name', { name: `%${name}%` });
        }

        // 分页和排序
        const total = await queryBuilder.getCount();
        const roles = await queryBuilder
            .orderBy('role.create_time', 'DESC')
            .skip((pageNo - 1) * pageSize)
            .take(pageSize)
            .getMany();

        return PageResult.of(pageNo, pageSize, total, roles);
    }
    
    /**
     * 根据ID获取角色（别名方法）
     */
    async findOne(id: number): Promise<SysRole> {
        return await this.findById(id);
    }

    /**
     * 更新角色
     */
    async update(updateRoleDto: UpdateRoleDto): Promise<SysRole> {
        const role = await this.findById(updateRoleDto.id);

        // 如果更新角色编码，检查是否重复
        if (updateRoleDto.code && updateRoleDto.code !== role.code) {
            const existingRole = await this.roleRepository.findOne({
                where: { code: updateRoleDto.code, isDeleted: false },
            });

            if (existingRole) {
                throw new RaxBizException('角色编码已存在');
            }
        }

        Object.assign(role, {
            ...updateRoleDto,
            updateBy: this.userContext.getUsername()!,
            updateTime: new Date()
        });

        return await this.roleRepository.save(role);
    }

    /**
     * 删除角色（软删除）
     */
    async remove(id: number): Promise<void> {
        const role = await this.findById(id);
        
        role.isDeleted = true;
        role.updateBy = this.userContext.getUsername()!;
        role.updateTime = new Date();
        
        await this.roleRepository.save(role);
    }

    /**
     * 获取所有角色列表（不分页）
     */
    async findAllRoles(): Promise<SysRole[]> {
        return await this.roleRepository.find({
            where: { isDeleted: false },
            order: { createTime: 'ASC' }
        });
    }
} 