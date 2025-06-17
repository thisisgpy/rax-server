import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { SysUser } from '../../entities/sysUser.entity';
import { SysOrg } from '../../entities/sysOrg.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUserDto } from './dto/query-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { PageResult } from '../../common/entities/page.entity';
import { RaxBizException } from '../../common/exceptions/rax-biz.exception';
import { SNOWFLAKE } from '../../common/providers';
import { Snowflake } from '../../common/utils/snowflake';
import { UserContext } from '../../common/context/user-context';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(SysUser)
        private readonly userRepository: Repository<SysUser>,
        @InjectRepository(SysOrg)
        private readonly sysOrgRepository: Repository<SysOrg>,
        @Inject(SNOWFLAKE)
        private readonly snowflake: Snowflake,
        @Inject('UserContext')
        private readonly userContext: UserContext
    ) {}

    /**
     * 创建用户
     */
    async create(createUserDto: CreateUserDto): Promise<SysUser> {
        // 检查手机号是否已存在
        const existingUser = await this.userRepository.findOne({
            where: { mobile: createUserDto.mobile, isDeleted: false }
        });
        if (existingUser) {
            throw new RaxBizException('手机号已存在');
        }
        
        // 无论用户提交什么密码，都使用默认密码
        const defaultUserPassword = process.env.DEFAULT_USER_PASSWORD || '123456';
        // 生成加密密码（bcrypt 自动管理 salt）
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(defaultUserPassword, saltRounds);

        // 创建用户对象
        const user = this.userRepository.create({
            id: this.snowflake.nextId(),
            ...createUserDto,
            password: hashedPassword,
            isInitPassword: false,
            isDeleted: false,
            createBy: this.userContext.getUsername()!,
            createTime: new Date(),
        });

        return await this.userRepository.save(user);
    }

    /**
     * 更新用户
     */
    async update(updateUserDto: UpdateUserDto): Promise<SysUser> {
        const user = await this.userRepository.findOne({
            where: { id: updateUserDto.id, isDeleted: false }
        });
        if (!user) {
            throw new RaxBizException(`用户不存在: ${updateUserDto.id}`);
        }

        // 如果更新手机号，检查是否重复
        if (updateUserDto.mobile && updateUserDto.mobile !== user.mobile) {
            const existingUser = await this.userRepository.findOne({
                where: { mobile: updateUserDto.mobile, isDeleted: false }
            });
            if (existingUser) {
                throw new RaxBizException('手机号已存在');
            }
        }

        // 更新用户信息
        Object.assign(user, {
            ...updateUserDto,
            updateBy: this.userContext.getUsername()!,
            updateTime: new Date()
        });

        return await this.userRepository.save(user);
    }

    /**
     * 删除用户（软删除）
     */
    async delete(id: number): Promise<boolean> {
        const user = await this.userRepository.findOne({
            where: { id, isDeleted: false }
        });
        if (!user) {
            throw new RaxBizException(`用户不存在: ${id}`);
        }

        user.isDeleted = true;
        user.updateBy = this.userContext.getUsername()!;
        user.updateTime = new Date();

        await this.userRepository.save(user);
        return true;
    }

    /**
     * 根据ID获取用户（不包含敏感信息）
     */
    async findById(id: number): Promise<UserResponseDto> {
        const queryBuilder = this.userRepository
            .createQueryBuilder('user')
            .leftJoinAndSelect('sys_org', 'org', 'user.org_id = org.id')
            .select([
                'user.id',
                'user.org_id',
                'user.mobile',
                'user.name',
                'user.gender',
                'user.id_card',
                'user.is_init_password',
                'user.status',
                'user.is_deleted',
                'user.create_time',
                'user.create_by',
                'user.update_time',
                'user.update_by',
                'org.name',
                'org.name_abbr'
            ])
            .where('user.id = :id', { id })
            .andWhere('user.is_deleted = :isDeleted', { isDeleted: false });

        const result = await queryBuilder.getRawOne();

        if (!result) {
            throw new RaxBizException(`用户不存在: ${id}`);
        }

        return this.convertToResponseDto(result);
    }

    /**
     * 根据ID获取用户（包含完整信息，用于内部验证）
     */
    private async findByIdWithPassword(id: number): Promise<SysUser> {
        const user = await this.userRepository.findOne({
            where: { id, isDeleted: false }
        });
        if (!user) {
            throw new RaxBizException(`用户不存在: ${id}`);
        }
        return user;
    }

    /**
     * 根据手机号获取用户
     */
    async findByMobile(mobile: string): Promise<SysUser | null> {
        return await this.userRepository.findOne({
            where: { mobile, isDeleted: false }
        });
    }

    /**
     * 分页查询用户
     */
    async findPage(queryDto: QueryUserDto): Promise<PageResult<UserResponseDto>> {
        const { pageNo = 1, pageSize = 10, ...conditions } = queryDto;
        
        const queryBuilder = this.userRepository
            .createQueryBuilder('user')
            .leftJoinAndSelect('sys_org', 'org', 'user.org_id = org.id')
            .select([
                'user.id',
                'user.org_id',
                'user.mobile',
                'user.name',
                'user.gender',
                'user.id_card',
                'user.is_init_password',
                'user.status',
                'user.is_deleted',
                'user.create_time',
                'user.create_by',
                'user.update_time',
                'user.update_by',
                'org.name',
                'org.name_abbr'
            ])
            .where('user.is_deleted = :isDeleted', { isDeleted: false });

        // 添加查询条件
        if (conditions.orgId) {
            queryBuilder.andWhere('user.org_id = :orgId', { orgId: conditions.orgId });
        }
        if (conditions.mobile) {
            queryBuilder.andWhere('user.mobile LIKE :mobile', { mobile: `%${conditions.mobile}%` });
        }
        if (conditions.name) {
            queryBuilder.andWhere('user.name LIKE :name', { name: `%${conditions.name}%` });
        }
        if (conditions.status !== undefined) {
            queryBuilder.andWhere('user.status = :status', { status: conditions.status });
        }

        // 获取总数
        const total = await queryBuilder.getCount();
        
        // 分页和排序
        const rawResults = await queryBuilder
            .orderBy('user.create_time', 'DESC')
            .skip((pageNo - 1) * pageSize)
            .take(pageSize)
            .getRawMany();

        // 转换为响应DTO
        const userList = rawResults.map(raw => this.convertToResponseDto(raw));

        return PageResult.of(pageNo, pageSize, total, userList);
    }

    /**
     * 重置密码
     */
    async resetPassword(id: number): Promise<boolean> {
        const user = await this.findByIdWithPassword(id);
        
        const defaultUserPassword = process.env.DEFAULT_USER_PASSWORD || '123456';

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(defaultUserPassword, saltRounds);

        user.password = hashedPassword;
        user.isInitPassword = false;
        user.updateBy = this.userContext.getUsername()!;
        user.updateTime = new Date();

        await this.userRepository.save(user);
        return true;
    }

    /**
     * 修改密码
     */
    async changePassword(id: number, oldPassword: string, newPassword: string): Promise<boolean> {
        // 获取完整的用户信息（包括密码和盐值）
        const user = await this.findByIdWithPassword(id);

        // 验证旧密码
        const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
        if (!isOldPasswordValid) {
            throw new RaxBizException('原密码不正确');
        }

        // 设置新密码
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        user.password = hashedPassword;
        user.isInitPassword = false;
        user.updateBy = this.userContext.getUsername()!;
        user.updateTime = new Date();

        await this.userRepository.save(user);
        return true;
    }

    /**
     * 转换查询结果为响应DTO
     * @param raw 原始查询结果
     * @returns 响应DTO
     */
    private convertToResponseDto(raw: any): UserResponseDto {
        const dto = new UserResponseDto();
        dto.id = raw.user_id;
        dto.orgId = raw.org_id;
        dto.orgName = raw.org_name || '';
        dto.orgNameAbbr = raw.name_abbr || '';
        dto.mobile = raw.user_mobile;
        dto.name = raw.user_name;
        dto.gender = raw.user_gender;
        dto.idCard = raw.id_card;
        dto.isInitPassword = Boolean(raw.is_init_password);
        dto.status = raw.user_status;
        dto.isDeleted = Boolean(raw.user_is_deleted);
        dto.createTime = raw.create_time;
        dto.createBy = raw.create_by;
        dto.updateTime = raw.update_time;
        dto.updateBy = raw.update_by;
        return dto;
    }
} 