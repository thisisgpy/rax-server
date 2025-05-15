import { Controller, Post, Body, Put, Delete, Param, Get, Query } from '@nestjs/common';
import { SysDictService } from './sysDict.service';
import { CreateDictDto } from './dto/create-dict.dto';
import { SysDict } from '../../entities/sysDict.entity';
import { UpdateDictDto } from './dto/update-dict.dto';
import { QueryDictDto } from './dto/query-dict.dto';
import { PageResult } from '../../common/entities/page.entity';
import { CreateDictItemDto } from './dto/create-dict-item.dto';
import { SysDictItem } from '../../entities/sysDictItem.entity';
import { UpdateDictItemDto } from './dto/update-dict-item.dto';
import { DictItemTreeDto, DictItemTreeResult } from './dto/dict-item-tree.dto';

@Controller('api/v1/dict')
export class SysDictController {
    constructor(private readonly sysDictService: SysDictService) {}

    @Post('create')
    async create(@Body() createDictDto: CreateDictDto): Promise<SysDict> {
        return this.sysDictService.create(createDictDto);
    }

    /**
     * 更新数据字典
     * @param updateDictDto 更新数据字典参数
     * @returns 更新后的数据字典
     */
    @Post('edit')
    async update(@Body() updateDictDto: UpdateDictDto): Promise<SysDict> {
        return await this.sysDictService.update(updateDictDto);
    }

    /**
     * 删除数据字典
     * @param id 字典ID
     */
    @Get('remove/:id')
    async remove(@Param('id') id: string): Promise<void> {
        await this.sysDictService.remove(id);
    }

    /**
     * 获取数据字典详情
     * @param id 字典ID
     * @returns 数据字典详情
     */
    @Get('get/:id')
    async findOne(@Param('id') id: string): Promise<SysDict> {
        return await this.sysDictService.findOne(id);
    }

    /**
     * 分页查询数据字典列表
     * @param queryDto 查询条件
     * @returns 分页数据
     */
    @Post('list')
    async findPage(@Body() queryDto: QueryDictDto): Promise<PageResult<SysDict>> {
        return await this.sysDictService.findPage(queryDto);
    }

    /**
     * 创建字典项
     * @param createDictItemDto 创建字典项参数
     * @returns 创建的字典项
     */
    @Post('item/create')
    async createDictItem(@Body() createDictItemDto: CreateDictItemDto): Promise<SysDictItem> {
        return await this.sysDictService.createDictItem(createDictItemDto);
    }

    /**
     * 更新字典项
     * @param updateDictItemDto 更新字典项参数
     * @returns 更新后的字典项
     */
    @Post('item/edit')
    async updateDictItem(@Body() updateDictItemDto: UpdateDictItemDto): Promise<SysDictItem> {
        return await this.sysDictService.updateDictItem(updateDictItemDto);
    }

    /**
     * 获取字典项详情
     * @param id 字典项ID
     * @returns 字典项详情
     */
    @Get('item/get/:id')
    async findDictItem(@Param('id') id: string): Promise<SysDictItem> {
        return await this.sysDictService.findDictItem(id);
    }

    /**
     * 删除字典项
     * @param id 字典项ID
     */
    @Get('item/remove/:id')
    async removeDictItem(@Param('id') id: string): Promise<void> {
        await this.sysDictService.removeDictItem(id);
    }

    /**
     * 根据字典编码查询字典项树
     * @param code 字典编码
     * @param onlyEnabled 是否只返回启用的项
     * @returns 树形结构的字典项列表
     */
    @Get('item/tree/:id')
    async findDictItemTreeById(
        @Param('id') id: string,
        @Query('onlyEnabled') onlyEnabled?: string
    ): Promise<DictItemTreeDto> {
        const showOnlyEnabled = onlyEnabled === undefined ? true : onlyEnabled === 'true';
        return await this.sysDictService.findDictItemTreeById(id, showOnlyEnabled);
    }
} 