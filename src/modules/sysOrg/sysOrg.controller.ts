import { Controller, Get, Post, Query, Body, Put, Param } from '@nestjs/common';
import { SysOrgService } from './sysOrg.service';
import { RaxBizException } from '../../common/exceptions/rax-biz.exception';
import { CreateOrgDto } from './dto/create-org.dto';
import { SysOrg } from '../../entities/sysOrg.entity';
import { UpdateOrgDto } from './dto/update-org.dto';
import { OrgTreeDto } from './dto/org-tree.dto';
import { ApiTags, ApiOperation, ApiParam, ApiQuery } from '@nestjs/swagger';
import { ApiRaxResponse } from '../../common/decorators/api-response.decorator';

@ApiTags('组织管理')
@Controller('api/v1/org')
export class SysOrgController {
    constructor(private readonly sysOrgService: SysOrgService) {}

    @ApiOperation({
        summary: '生成组织编码',
        description: '根据父级组织ID生成新的组织编码'
    })
    @ApiQuery({
        name: 'parentId',
        description: '父级组织ID',
        type: Number,
        required: true
    })
    @ApiRaxResponse({
        description: '生成成功',
        type: String
    })
    @Get('codegen')
    async generateOrgCode(@Query('parentId') parentId: string): Promise<string> {
        const parentIdNum = parseInt(parentId);
        if (!parentId || isNaN(parentIdNum)) {
            throw new RaxBizException('父级组织ID不能为空');
        }
        return await this.sysOrgService.generateOrgCode(parentIdNum);
    }

    @ApiOperation({
        summary: '创建组织',
        description: '创建新的组织'
    })
    @ApiRaxResponse({
        description: '创建成功',
        type: SysOrg
    })
    @Post('create')
    async create(@Body() createOrgDto: CreateOrgDto): Promise<SysOrg> {
        return await this.sysOrgService.create(createOrgDto);
    }

    @ApiOperation({
        summary: '更新组织',
        description: '更新组织信息'
    })
    @ApiRaxResponse({
        description: '更新成功',
        type: Boolean
    })
    @Post('edit')
    async edit(@Body() updateOrgDto: UpdateOrgDto): Promise<boolean> {
        return await this.sysOrgService.update(updateOrgDto);
    }

    @ApiOperation({
        summary: '删除组织',
        description: '根据ID删除组织'
    })
    @ApiParam({
        name: 'id',
        description: '组织ID',
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
            throw new RaxBizException('组织ID必须是数字');
        }
        return await this.sysOrgService.delete(idNum);
    }

    @ApiOperation({
        summary: '获取组织树',
        description: '根据组织ID获取其下级组织树结构'
    })
    @ApiParam({
        name: 'id',
        description: '组织ID',
        type: Number
    })
    @ApiRaxResponse({
        description: '获取成功',
        type: OrgTreeDto
    })
    @Get('tree/:id')
    async getOrgTree(@Param('id') id: string): Promise<OrgTreeDto> {
        const idNum = parseInt(id);
        if (isNaN(idNum)) {
            throw new RaxBizException('组织ID必须是数字');
        }
        return await this.sysOrgService.getOrgTree(idNum);
    }

    @ApiOperation({
        summary: '获取组织详情',
        description: '根据组织ID获取组织详细信息'
    })
    @ApiParam({
        name: 'id',
        description: '组织ID',
        type: Number
    })
    @ApiRaxResponse({
        description: '获取成功',
        type: SysOrg
    })
    @Get('get/:id')
    async getOrgById(@Param('id') id: string): Promise<SysOrg> {
        const idNum = parseInt(id);
        if (isNaN(idNum)) {
            throw new RaxBizException('组织ID必须是数字');
        }
        return await this.sysOrgService.getOrgById(idNum);
    }

    @ApiOperation({
        summary: '获取所有组织树',
        description: '获取所有组织的树形结构'
    })
    @ApiRaxResponse({
        description: '获取成功',
        type: OrgTreeDto,
        isArray: true
    })
    @Get('trees')
    async getOrgTrees(): Promise<OrgTreeDto[]> {
        return await this.sysOrgService.getOrgTrees();
    }
} 