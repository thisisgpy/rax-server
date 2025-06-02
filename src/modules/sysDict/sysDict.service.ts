import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, Not, Like } from 'typeorm';
import { SysDict } from '../../entities/sysDict.entity';
import { SysDictItem } from '../../entities/sysDictItem.entity';
import { SNOWFLAKE } from '../../common/providers';
import { Snowflake } from '../../common/utils/snowflake';
import { UserContext } from '../../common/context/user-context';
import { CreateDictDto } from './dto/create-dict.dto';
import { RaxBizException } from '../../common/exceptions/rax-biz.exception';
import { UpdateDictDto } from './dto/update-dict.dto';
import { QueryDictDto } from './dto/query-dict.dto';
import { PageResult } from '../../common/entities/page.entity';
import { CreateDictItemDto } from './dto/create-dict-item.dto';
import { UpdateDictItemDto } from './dto/update-dict-item.dto';
import { DictItemTreeDto } from './dto/dict-item-tree.dto';

@Injectable()
export class SysDictService {
    constructor(
        @InjectRepository(SysDict)
        private readonly sysDictRepository: Repository<SysDict>,
        @InjectRepository(SysDictItem)
        private readonly sysDictItemRepository: Repository<SysDictItem>,
        @Inject(SNOWFLAKE)
        private readonly snowflake: Snowflake,
        private readonly dataSource: DataSource,
        @Inject('UserContext')
        private readonly userContext: UserContext
    ) {}

    /**
     * 创建数据字典
     * 1. 检查字典编码是否重复
     * 2. 检查字典名称是否重复
     * 3. 创建数据字典
     * @param createDictDto 创建数据字典的数据
     * @returns 创建的数据字典
     */
    async create(createDictDto: CreateDictDto): Promise<SysDict> {
        // 1. 检查字典编码是否重复
        const existingDictByCode = await this.sysDictRepository.findOne({
            where: { code: createDictDto.code }
        });
        if (existingDictByCode) {
            throw new RaxBizException(`字典编码已存在: ${createDictDto.code}`);
        }

        // 2. 检查字典名称是否重复
        const existingDictByName = await this.sysDictRepository.findOne({
            where: { name: createDictDto.name }
        });
        if (existingDictByName) {
            throw new RaxBizException(`字典名称已存在: ${createDictDto.name}`);
        }

        // 3. 创建数据字典
        const dict = this.sysDictRepository.create({
            id: this.snowflake.nextId(),
            code: createDictDto.code,
            name: createDictDto.name,
            comment: createDictDto.comment,
            isEnabled: createDictDto.isEnabled ?? true,
            createBy: this.userContext.getUsername()!,
            createTime: new Date()
        });

        // 4. 使用事务保存数据字典
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const savedDict = await queryRunner.manager.save(dict);
            await queryRunner.commitTransaction();
            return savedDict;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    /**
     * 更新数据字典
     * @param updateDictDto 更新数据字典参数
     * @returns 更新后的数据字典
     */
    async update(updateDictDto: UpdateDictDto): Promise<SysDict> {
        // 1. 检查字典是否存在
        const dict = await this.sysDictRepository.findOne({
            where: { id: updateDictDto.id }
        });

        if (!dict) {
            throw new NotFoundException(`未找到ID为${updateDictDto.id}的数据字典`);
        }

        // 2. 检查名称是否与其他字典重复（排除自身）
        const existingDictByName = await this.sysDictRepository.findOne({
            where: { 
                name: updateDictDto.name,
                id: Not(updateDictDto.id) // 排除自身
            }
        });

        if (existingDictByName) {
            throw new RaxBizException(`字典名称已存在: ${updateDictDto.name}`);
        }

        // 3. 更新字典信息
        dict.name = updateDictDto.name;
        dict.comment = updateDictDto.comment;
        dict.isEnabled = updateDictDto.isEnabled;
        dict.updateBy = this.userContext.getUsername()!;
        dict.updateTime = new Date();

        // 4. 使用事务保存更新
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const savedDict = await queryRunner.manager.save(dict);
            await queryRunner.commitTransaction();
            return savedDict;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    /**
     * 删除数据字典
     * 如果字典下存在字典项，则不允许删除
     * @param id 字典ID
     */
    async remove(id: number): Promise<void> {
        // 1. 检查字典是否存在
        const dict = await this.sysDictRepository.findOne({
            where: { id }
        });

        if (!dict) {
            throw new NotFoundException(`未找到ID为${id}的数据字典`);
        }

        // 2. 检查是否存在字典项
        const dictItemCount = await this.sysDictItemRepository.count({
            where: { dictId: id }
        });

        if (dictItemCount > 0) {
            throw new RaxBizException(`无法删除字典"${dict.name}"，该字典下存在${dictItemCount}个字典项`);
        }

        // 3. 使用事务删除字典
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            await queryRunner.manager.remove(dict);
            await queryRunner.commitTransaction();
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    /**
     * 获取数据字典详情
     * @param id 字典ID
     * @returns 数据字典详情
     */
    async findOne(id: number): Promise<SysDict> {
        const dict = await this.sysDictRepository.findOne({
            where: { id }
        });

        if (!dict) {
            throw new NotFoundException(`未找到ID为${id}的数据字典`);
        }

        return dict;
    }

    /**
     * 分页查询数据字典列表
     * @param queryDto 查询条件
     * @returns 分页数据
     */
    async findPage(queryDto: QueryDictDto): Promise<PageResult<SysDict>> {
        const { pageNo, pageSize, code, name, isEnabled } = queryDto;
        
        // 1. 构建查询条件
        const where: any = {};
        if (code) {
            where.code = Like(`%${code}%`);
        }
        if (name) {
            where.name = Like(`%${name}%`);
        }
        if (isEnabled !== undefined) {
            where.isEnabled = isEnabled;
        }

        // 2. 执行分页查询
        const [rows, total] = await this.sysDictRepository.findAndCount({
            where,
            skip: (pageNo - 1) * pageSize,
            take: pageSize,
            order: {
                createTime: 'DESC'  // 按创建时间倒序
            }
        });

        // 3. 返回分页结果
        return PageResult.of(pageNo, pageSize, total, rows);
    }

    /**
     * 获取字典项详情
     * @param id 字典项ID
     * @returns 字典项详情
     */
    async findDictItem(id: number): Promise<SysDictItem> {
        const dictItem = await this.sysDictItemRepository.findOne({
            where: { id }
        });

        if (!dictItem) {
            throw new NotFoundException(`未找到ID为${id}的字典项`);
        }

        return dictItem;
    }

    /**
     * 创建字典项
     * @param createDictItemDto 创建字典项参数
     * @returns 创建的字典项
     */
    async createDictItem(createDictItemDto: CreateDictItemDto): Promise<SysDictItem> {
        // 1. 检查字典是否存在
        const dict = await this.findOne(createDictItemDto.dictId);

        // 2. 检查字典编码是否匹配
        if (dict.code !== createDictItemDto.dictCode) {
            throw new RaxBizException(`字典编码不匹配: ${createDictItemDto.dictCode}`);
        }

        // 3. 如果有父级ID，检查父级是否存在
        if (createDictItemDto.parentId && createDictItemDto.parentId !== 0) {
            await this.findDictItem(createDictItemDto.parentId);
        }

        // 4. 检查同一字典下的字典项值是否重复
        const existingDictItem = await this.sysDictItemRepository.findOne({
            where: { 
                dictId: createDictItemDto.dictId,
                value: createDictItemDto.value
            }
        });

        if (existingDictItem) {
            throw new RaxBizException(`字典项值已存在: ${createDictItemDto.value}`);
        }

        // 5. 创建字典项
        const dictItem = this.sysDictItemRepository.create({
            id: this.snowflake.nextId(),
            dictId: createDictItemDto.dictId,
            dictCode: createDictItemDto.dictCode,
            label: createDictItemDto.label,
            value: createDictItemDto.value,
            comment: createDictItemDto.comment,
            sort: createDictItemDto.sort || 0,
            parentId: createDictItemDto.parentId || 0,
            isEnabled: createDictItemDto.isEnabled ?? true,
            createBy: this.userContext.getUsername()!,
            createTime: new Date()
        });

        // 6. 使用事务保存字典项
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const savedDictItem = await queryRunner.manager.save(dictItem);
            await queryRunner.commitTransaction();
            return savedDictItem;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    /**
     * 获取字典项的所有子孙ID
     * @param dictId 字典ID
     * @param itemId 字典项ID
     * @returns 子孙ID列表
     */
    private async getDescendantIds(dictId: number, itemId: number): Promise<number[]> {
        const descendants: number[] = [];
        const stack: number[] = [itemId];

        while (stack.length > 0) {
            const currentId = stack.pop()!;
            descendants.push(currentId);

            // 查找直接子项
            const children = await this.sysDictItemRepository.find({
                where: {
                    dictId: dictId,
                    parentId: currentId
                },
                select: ['id']
            });

            // 将子项添加到栈中继续处理
            stack.push(...children.map(child => child.id));
        }

        return descendants;
    }

    /**
     * 更新字典项
     * @param updateDictItemDto 更新字典项参数
     * @returns 更新后的字典项
     */
    async updateDictItem(updateDictItemDto: UpdateDictItemDto): Promise<SysDictItem> {
        // 1. 获取要更新的字典项
        const dictItem = await this.findDictItem(updateDictItemDto.id);

        // 2. 如果有父级ID，进行父级相关检查
        if (updateDictItemDto.parentId) {
            // 2.1 检查父级不能是自己
            if (updateDictItemDto.parentId === updateDictItemDto.id) {
                throw new RaxBizException('父级字典项不能是自己');
            }

            // 2.2 如果父级不是根节点，检查父级是否存在
            if (updateDictItemDto.parentId !== 0) {
                const parentItem = await this.findDictItem(updateDictItemDto.parentId);
                
                // 2.3 检查父级必须在同一个字典下
                if (parentItem.dictId !== dictItem.dictId) {
                    throw new RaxBizException('父级字典项必须在同一个字典下');
                }

                // 2.4 检查新的父级不能是当前节点的子孙
                const descendants = await this.getDescendantIds(dictItem.dictId, updateDictItemDto.id);
                if (descendants.includes(updateDictItemDto.parentId)) {
                    throw new RaxBizException('父级字典项不能是当前节点的子孙');
                }
            }
        }

        // 3. 检查同一字典下的字典项值是否重复（排除自身）
        const existingDictItem = await this.sysDictItemRepository.findOne({
            where: { 
                dictId: dictItem.dictId,
                value: updateDictItemDto.value,
                id: Not(updateDictItemDto.id)
            }
        });

        if (existingDictItem) {
            throw new RaxBizException(`字典项值已存在: ${updateDictItemDto.value}`);
        }

        // 4. 更新字典项
        dictItem.label = updateDictItemDto.label;
        dictItem.value = updateDictItemDto.value;
        dictItem.comment = updateDictItemDto.comment;
        dictItem.sort = updateDictItemDto.sort ?? dictItem.sort;
        dictItem.parentId = updateDictItemDto.parentId ?? dictItem.parentId;
        dictItem.isEnabled = updateDictItemDto.isEnabled ?? dictItem.isEnabled;
        dictItem.updateBy = this.userContext.getUsername()!;
        dictItem.updateTime = new Date();

        // 5. 使用事务保存更新
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const savedDictItem = await queryRunner.manager.save(dictItem);
            await queryRunner.commitTransaction();
            return savedDictItem;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    /**
     * 删除字典项
     * @param id 字典项ID
     * @throws RaxBizException 当存在子孙节点时
     */
    async removeDictItem(id: number): Promise<void> {
        // 1. 检查字典项是否存在
        const dictItem = await this.findDictItem(id);

        // 2. 检查是否存在子孙节点
        const descendants = await this.getDescendantIds(dictItem.dictId, id);
        // descendants 包含自身，所以要大于1才表示有子孙
        if (descendants.length > 1) {
            throw new RaxBizException(`无法删除，该字典项存在${descendants.length - 1}个子项`);
        }

        // 3. 使用事务删除字典项
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            await queryRunner.manager.remove(dictItem);
            await queryRunner.commitTransaction();
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }

    /**
     * 获取字典项的子项。递归，构建树形结构。
     * @param dictId 字典ID
     * @param itemParentId 字典项父ID
     * @param onlyEnabled 是否只返回启用的项，默认true
     * @returns 子项列表
     */
    private async getItemChildren(dictId: number, itemParentId: number, onlyEnabled: boolean = true): Promise<DictItemTreeDto[]> {
        // 查询 dictId 下所有 parentId 为 itemParentId 的子项
        const subItems = await this.sysDictItemRepository.find({
            where: {
                dictId,
                parentId: itemParentId,
                isEnabled: onlyEnabled ? true : undefined
            },
            order: {
                sort: 'ASC',
                id: 'ASC'  // 当 sort 相同时，使用 id 排序确保顺序稳定
            }
        });

        // 将 subItems 转换为 DictItemTreeDto，并递归查询每个节点的子项
        const children = await Promise.all(subItems.map(async (item) => {
            const node: DictItemTreeDto = {
                id: item.id,
                label: item.label,
                value: item.value,
                comment: item.comment,
                sort: item.sort,
                isEnabled: item.isEnabled,
                children: await this.getItemChildren(dictId, item.id)  // 递归查询子项
            };
            return node;
        }));

        return children;
    }

    /**
     * 根据字典ID查询字典项树
     * @param id 字典ID
     * @param onlyEnabled 是否只返回启用的项，默认true
     * @returns 树形结构的字典项列表
     */
    async findDictItemTreeById(id: number, onlyEnabled: boolean = true): Promise<DictItemTreeDto> {
        // 1. 查询字典是否存在
        const dict = await this.findOne(id);
        const root = new DictItemTreeDto();
        const children = await this.getItemChildren(dict.id, 0, onlyEnabled)
        root.children = children;
        return root;
    }

    /**
     * 根据字典编码获取字典项树形结构
     * @param code 字典编码
     * @param onlyEnabled 是否只返回启用的项
     * @returns 字典项树形结构
     */
    async findDictItemTreeByCode(code: string, onlyEnabled: boolean): Promise<DictItemTreeDto> {
        // 先通过编码查询字典
        const dict = await this.sysDictRepository.findOne({
            where: { code }
        });

        if (!dict) {
            throw new RaxBizException(`字典编码 ${code} 不存在`);
        }

        // 复用原有的通过ID查询的逻辑
        return this.findDictItemTreeById(dict.id, onlyEnabled);
    }
} 