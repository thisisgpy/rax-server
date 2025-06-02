import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { SysDictService } from './sysDict.service';
import { CreateDictDto } from './dto/create-dict.dto';
import { SysDict } from '../../entities/sysDict.entity';
import { UpdateDictDto } from './dto/update-dict.dto';
import { QueryDictDto } from './dto/query-dict.dto';
import { PageResult } from '../../common/entities/page.entity';
import { CreateDictItemDto } from './dto/create-dict-item.dto';
import { SysDictItem } from '../../entities/sysDictItem.entity';
import { UpdateDictItemDto } from './dto/update-dict-item.dto';
import { DictItemTreeDto } from './dto/dict-item-tree.dto';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { ApiRaxResponse } from '../../common/decorators/api-response.decorator';

@ApiTags('数据字典管理')
@Controller('api/v1/dict')
export class SysDictController {
    constructor(private readonly sysDictService: SysDictService) {}

    @ApiOperation({
        summary: '创建数据字典',
        description: '创建一个新的数据字典'
    })
    @ApiRaxResponse({
        description: '创建成功',
        type: SysDict
    })
    @Post('create')
    async create(@Body() createDictDto: CreateDictDto): Promise<SysDict> {
        return this.sysDictService.create(createDictDto);
    }

    @ApiOperation({
        summary: '更新数据字典',
        description: '根据ID更新数据字典信息'
    })
    @ApiRaxResponse({
        description: '更新成功',
        type: SysDict
    })
    @Post('edit')
    async update(@Body() updateDictDto: UpdateDictDto): Promise<SysDict> {
        return await this.sysDictService.update(updateDictDto);
    }

    @ApiOperation({
        summary: '删除数据字典',
        description: '根据ID删除数据字典'
    })
    @ApiParam({
        name: 'id',
        description: '字典ID'
    })
    @ApiRaxResponse({
        description: '删除成功',
        type: Boolean
    })
    @Get('remove/:id')
    async remove(@Param('id') id: number): Promise<void> {
        await this.sysDictService.remove(id);
    }

    @ApiOperation({
        summary: '获取数据字典详情',
        description: '根据ID获取数据字典详细信息'
    })
    @ApiParam({
        name: 'id',
        description: '字典ID'
    })
    @ApiRaxResponse({
        description: '获取成功',
        type: SysDict
    })
    @Get('get/:id')
    async findOne(@Param('id') id: number): Promise<SysDict> {
        return await this.sysDictService.findOne(id);
    }

    @ApiOperation({
        summary: '分页查询数据字典',
        description: '根据条件分页查询数据字典列表'
    })
    @ApiRaxResponse({
        description: '查询成功',
        type: PageResult<SysDict>
    })
    @Post('list')
    async findPage(@Body() queryDto: QueryDictDto): Promise<PageResult<SysDict>> {
        return await this.sysDictService.findPage(queryDto);
    }

    @ApiOperation({
        summary: '创建字典项',
        description: '为指定数据字典创建字典项'
    })
    @ApiRaxResponse({
        description: '创建成功',
        type: SysDictItem
    })
    @Post('item/create')
    async createDictItem(@Body() createDictItemDto: CreateDictItemDto): Promise<SysDictItem> {
        return await this.sysDictService.createDictItem(createDictItemDto);
    }

    @ApiOperation({
        summary: '更新字典项',
        description: '根据ID更新字典项信息'
    })
    @ApiRaxResponse({
        description: '更新成功',
        type: SysDictItem
    })
    @Post('item/edit')
    async updateDictItem(@Body() updateDictItemDto: UpdateDictItemDto): Promise<SysDictItem> {
        return await this.sysDictService.updateDictItem(updateDictItemDto);
    }

    @ApiOperation({
        summary: '获取字典项详情',
        description: '根据ID获取字典项详细信息'
    })
    @ApiParam({
        name: 'id',
        description: '字典项ID'
    })
    @ApiRaxResponse({
        description: '获取成功',
        type: SysDictItem
    })
    @Get('item/get/:id')
    async findDictItem(@Param('id') id: number): Promise<SysDictItem> {
        return await this.sysDictService.findDictItem(id);
    }

    @ApiOperation({
        summary: '删除字典项',
        description: '根据ID删除字典项'
    })
    @ApiParam({
        name: 'id',
        description: '字典项ID'
    })
    @ApiRaxResponse({
        description: '删除成功',
        type: Boolean
    })
    @Get('item/remove/:id')
    async removeDictItem(@Param('id') id: number): Promise<void> {
        await this.sysDictService.removeDictItem(id);
    }

    @ApiOperation({
        summary: '获取字典项树形结构',
        description: '根据字典编码获取字典项的树形结构'
    })
    @ApiParam({
        name: 'code',
        description: '字典编码',
        type: String
    })
    @ApiParam({
        name: 'onlyEnabled',
        description: '是否只返回启用的项',
        type: Boolean
    })
    @ApiRaxResponse({
        description: '获取成功',
        type: DictItemTreeDto
    })
    @Get('item/tree/:code/:onlyEnabled')
    async findDictItemTreeByCode(
        @Param('code') code: string,
        @Param('onlyEnabled') onlyEnabled: boolean = true
    ): Promise<DictItemTreeDto> {
        const showOnlyEnabled = onlyEnabled;
        return await this.sysDictService.findDictItemTreeByCode(code, showOnlyEnabled);
    }
} 