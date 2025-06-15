import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { AssetFixedService } from './assetFixed.service';
import { CreateAssetFixedDto } from './dto/create-asset-fixed.dto';
import { UpdateAssetFixedDto } from './dto/update-asset-fixed.dto';
import { QueryAssetFixedDto } from './dto/query-asset-fixed.dto';
import { AssetFixedResponseDto } from './dto/asset-fixed-response.dto';
import { AssetFixed } from '../../entities/assetFixed.entity';
import { PageResult } from '../../common/entities/page.entity';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { ApiRaxResponse } from '../../common/decorators/api-response.decorator';
import { RaxBizException } from '../../common/exceptions/rax-biz.exception';

@ApiTags('固定资产管理')
@Controller('api/v1/asset/fixed')
export class AssetFixedController {
    constructor(private readonly assetFixedService: AssetFixedService) {}

    @ApiOperation({
        summary: '创建固定资产',
        description: '创建新的固定资产'
    })
    @ApiRaxResponse({
        description: '创建成功',
        type: AssetFixed
    })
    @Post('create')
    async create(@Body() createAssetFixedDto: CreateAssetFixedDto): Promise<AssetFixed> {
        return await this.assetFixedService.create(createAssetFixedDto);
    }

    @ApiOperation({
        summary: '更新固定资产',
        description: '更新固定资产信息'
    })
    @ApiRaxResponse({
        description: '更新成功',
        type: AssetFixed
    })
    @Post('edit')
    async edit(@Body() updateAssetFixedDto: UpdateAssetFixedDto): Promise<AssetFixed> {
        return await this.assetFixedService.update(updateAssetFixedDto);
    }

    @ApiOperation({
        summary: '删除固定资产',
        description: '根据ID删除固定资产（软删除）'
    })
    @ApiParam({
        name: 'id',
        description: '固定资产ID',
        type: Number
    })
    @ApiRaxResponse({
        description: '删除成功',
        type: Boolean
    })
    @Get('remove/:id')
    async remove(@Param('id') id: string): Promise<boolean> {
        const idNum = parseInt(id);
        if (isNaN(idNum)) {
            throw new RaxBizException('固定资产ID必须是数字');
        }
        return await this.assetFixedService.delete(idNum);
    }

    @ApiOperation({
        summary: '获取固定资产详情',
        description: '根据固定资产ID获取详细信息'
    })
    @ApiParam({
        name: 'id',
        description: '固定资产ID',
        type: Number
    })
    @ApiRaxResponse({
        description: '获取成功',
        type: AssetFixedResponseDto
    })
    @Get('get/:id')
    async getById(@Param('id') id: string): Promise<AssetFixedResponseDto> {
        const idNum = parseInt(id);
        if (isNaN(idNum)) {
            throw new RaxBizException('固定资产ID必须是数字');
        }
        return await this.assetFixedService.findById(idNum);
    }

    @ApiOperation({
        summary: '分页查询固定资产',
        description: '分页查询固定资产列表，支持按名称和组织筛选'
    })
    @ApiRaxResponse({
        description: '查询成功',
        type: PageResult<AssetFixedResponseDto>
    })
    @Post('search')
    async search(@Body() queryAssetFixedDto: QueryAssetFixedDto): Promise<PageResult<AssetFixedResponseDto>> {
        return await this.assetFixedService.findPage(queryAssetFixedDto);
    }
} 