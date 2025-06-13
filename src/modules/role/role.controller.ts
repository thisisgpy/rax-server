import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { SysRole } from '../../entities/sysRole.entity';
import { PageResult } from '../../common/entities/page.entity';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { ApiRaxResponse } from '../../common/decorators/api-response.decorator';
import { RaxBizException } from '../../common/exceptions/rax-biz.exception';
import { UpdateRoleDto } from './dto/update-role.dto';
import { QueryRoleDto } from './dto/query-role.dto';

@ApiTags('角色管理')
@Controller('api/v1/role')
export class RoleController {
    constructor(private readonly roleService: RoleService) {}

    @ApiOperation({
        summary: '创建角色',
        description: '创建新角色'
    })
    @ApiRaxResponse({
        description: '创建成功',
        type: SysRole
    })
    @Post('create')
    async create(@Body() createRoleDto: CreateRoleDto): Promise<SysRole> {
        return await this.roleService.create(createRoleDto);
    }

    @ApiOperation({
        summary: '更新角色',
        description: '更新角色信息'
    })
    @ApiRaxResponse({
        description: '更新成功',
        type: SysRole
    })
    @Post('edit')
    async update(@Body() updateRoleDto: UpdateRoleDto): Promise<SysRole> {
        return await this.roleService.update(updateRoleDto);
    }

    @ApiOperation({
        summary: '删除角色',
        description: '软删除角色'
    })
    @ApiParam({
        name: 'id',
        description: '角色ID',
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
            throw new RaxBizException('角色ID必须是数字');
        }
        await this.roleService.remove(idNum);
        return true;
    }

    @ApiOperation({
        summary: '获取角色详情',
        description: '根据ID获取角色详细信息'
    })
    @ApiParam({
        name: 'id',
        description: '角色ID',
        type: Number
    })
    @ApiRaxResponse({
        description: '获取成功',
        type: SysRole
    })
    @Get('get/:id')
    async findById(@Param('id') id: string): Promise<SysRole> {
        const idNum = parseInt(id);
        if (isNaN(idNum)) {
            throw new RaxBizException('角色ID必须是数字');
        }
        return await this.roleService.findById(idNum);
    }

    @ApiOperation({
        summary: '分页查询角色',
        description: '根据条件分页查询角色列表'
    })
    @ApiRaxResponse({
        description: '查询成功',
        type: PageResult<SysRole>
    })
    @Post('list')
    async findPage(@Body() queryRoleDto: QueryRoleDto): Promise<PageResult<SysRole>> {
        return await this.roleService.findPage(queryRoleDto);
    }

    @ApiOperation({
        summary: '获取所有角色',
        description: '获取所有未删除的角色列表（不分页）'
    })
    @ApiRaxResponse({
        description: '获取成功',
        type: SysRole,
        isArray: true
    })
    @Get('all')
    async findAll(): Promise<SysRole[]> {
        return await this.roleService.findAllRoles();
    }
} 