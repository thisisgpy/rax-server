import { Controller, Get, Post, Query, Body, Put, Param } from '@nestjs/common';
import { SysOrgService } from './sysOrg.service';
import { RaxBizException } from '../../common/exceptions/rax-biz.exception';
import { CreateOrgDto } from './dto/create-org.dto';
import { SysOrg } from '../../entities/sysOrg.entity';
import { UpdateOrgDto } from './dto/update-org.dto';
import { OrgTreeDto } from './dto/org-tree.dto';

@Controller('api/v1/org')
export class SysOrgController {
    constructor(private readonly sysOrgService: SysOrgService) {}

    /**
     * 生成组织编码
     * @param parentId 父级组织ID
     * @returns 组织编码
     */
    @Get('codegen')
    async generateOrgCode(@Query('parentId') parentId: string): Promise<string> {
        if (!parentId) {
            throw new RaxBizException('父级组织ID不能为空');
        }
        return await this.sysOrgService.generateOrgCode(parentId);
    }

    /**
     * 创建组织
     * @param createOrgDto 创建组织的数据
     * @returns 创建的组织
     */
    @Post('create')
    async create(@Body() createOrgDto: CreateOrgDto): Promise<SysOrg> {
        return await this.sysOrgService.create(createOrgDto);
    }

    /**
     * 更新组织
     * @param updateOrgDto 更新组织的数据
     * @returns 更新后的组织
     */
    @Post('edit')
    async edit(@Body() updateOrgDto: UpdateOrgDto): Promise<boolean> {
        return await this.sysOrgService.update(updateOrgDto);
    }

    /** 
     * 删除组织
     * @param id 组织ID
     * @returns 删除是否成功
     */
    @Get('remove/:id')
    async remove(@Param('id') id: string): Promise<boolean> {
        return await this.sysOrgService.delete(id);
    }

    /**
     * 获取组织树
     * @param id 组织ID
     * @returns 组织树
     */
    @Get('tree/:id')
    async getOrgTree(@Param('id') id: string): Promise<OrgTreeDto> {
        return await this.sysOrgService.getOrgTree(id);
    }

    /**
     * 根据组织ID获取组织
     * @param id 组织ID
     * @returns 组织
     */
    @Get('get/:id')
    async getOrgById(@Param('id') id: string): Promise<SysOrg> {
        return await this.sysOrgService.getOrgById(id);
    }

    /**
     * 获取所有组织树
     * @returns 组织树数组
     */
    @Get('trees')
    async getOrgTrees(): Promise<OrgTreeDto[]> {
        return await this.sysOrgService.getOrgTrees();
    }
} 