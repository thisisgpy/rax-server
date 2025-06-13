import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { PermissionService } from './permission.service';
import { AssignUserRoleDto } from './dto/assign-user-role.dto';
import { ApiRaxResponse } from '../../common/decorators/api-response.decorator';
import { RaxBizException } from '../../common/exceptions/rax-biz.exception';
import { AssignRoleResourceDto } from './dto/assign-role-resource.dto';
import { CheckPermissionDto } from './dto/check-permission.dto';
import { SysRole } from 'src/entities/sysRole.entity';
import { SysResource } from '../../entities/sysResource.entity';
import { MenuListType, MenuListDto } from './dto/menu-list.dto';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
  
@ApiTags('权限管理')
@Controller('api/v1/permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @ApiOperation({
    summary: '分配用户角色',
    description: '为用户分配角色权限'
  })
  @ApiRaxResponse({
    description: '分配成功',
    type: Boolean
  })
  @Post('assign-user-roles')
  async assignUserRoles(@Body() assignUserRoleDto: AssignUserRoleDto): Promise<boolean> {
    return await this.permissionService.assignUserRoles(assignUserRoleDto);
  }

  @ApiOperation({
    summary: '分配角色资源',
    description: '为角色分配资源权限'
  })
  @ApiRaxResponse({
    description: '分配成功',
    type: Boolean
  })
  @Post('assign-role-resources')
  async assignRoleResources(@Body() assignRoleResourceDto: AssignRoleResourceDto): Promise<boolean> {
    return await this.permissionService.assignRoleResources(assignRoleResourceDto.roleId, assignRoleResourceDto.resourceIds);
  }

  @ApiOperation({
    summary: '获取用户权限',
    description: '获取用户的所有权限资源编码'
  })
  @ApiParam({
    name: 'id',
    description: '用户ID',
    type: Number
  })
  @ApiRaxResponse({
    description: '获取成功',
    type: String,
    isArray: true
  })
  @Get('user-permissions/:id')
  async getUserPermissions(@Param('id') id: string): Promise<string[]> {
    const idNum = parseInt(id);
    if (isNaN(idNum)) {
      throw new RaxBizException('用户ID必须是数字');
    }
    return await this.permissionService.getUserPermissions(idNum);
  }

  @ApiOperation({
    summary: '获取用户菜单',
    description: '获取用户的菜单权限（Vue-Router路由结构）'
  })
  @ApiParam({
    name: 'id',
    description: '用户ID',
    type: Number
  })
  @ApiRaxResponse({
    description: '获取成功',
    type: MenuListDto,
    isArray: true
  })
  @Get('user-menus/:id')
  async getUserMenus(@Param('id') id: string): Promise<MenuListType[]> {
    const idNum = parseInt(id);
    if (isNaN(idNum)) {
      throw new RaxBizException('用户ID必须是数字');
    }
    return await this.permissionService.getUserMenus(idNum);
  }

  @ApiOperation({
    summary: '检查用户权限',
    description: '检查用户是否有特定资源的权限'
  })
  @ApiRaxResponse({
    description: '检查完成',
    type: Boolean
  })
  @Post('check-permission')
  async checkPermission(@Body() checkPermissionDto: CheckPermissionDto): Promise<boolean> {
    return await this.permissionService.hasPermission(checkPermissionDto.userId, checkPermissionDto.resourceCode);
  }

  @ApiOperation({
    summary: '获取用户角色',
    description: '获取用户的角色ID列表'
  })
  @ApiParam({
    name: 'id',
    description: '用户ID',
    type: Number
  })
  @ApiRaxResponse({
    description: '获取成功',
    type: SysRole,
    isArray: true
  })
  @Get('user-roles/:id')
  async getUserRoles(@Param('id') id: string): Promise<SysRole[]> {
    const idNum = parseInt(id);
    if (isNaN(idNum)) {
      throw new RaxBizException('用户ID必须是数字');
    }
    return await this.permissionService.getUserRoles(idNum);
  }

  @ApiOperation({
    summary: '获取角色资源',
    description: '获取角色的资源权限ID列表'
  })
  @ApiParam({
    name: 'id',
    description: '角色ID',
    type: Number
  })
  @ApiRaxResponse({
    description: '获取成功',
    type: Number,
    isArray: true
  })
  @Get('role-resources/:id')
  async getRoleResources(@Param('id') id: string): Promise<number[]> {
    const idNum = parseInt(id);
    if (isNaN(idNum)) {
      throw new RaxBizException('角色ID必须是数字');
    }
    return await this.permissionService.getRoleResources(idNum);
  }

  // ================== 资源管理 CRUD 接口 ==================

  @ApiOperation({
    summary: '创建资源',
    description: '创建新的系统资源'
  })
  @ApiRaxResponse({
    description: '创建成功',
    type: SysResource
  })
  @Post('resource/create')
  async createResource(@Body() createResourceDto: CreateResourceDto): Promise<SysResource> {
    return await this.permissionService.createResource(createResourceDto);
  }

  @ApiOperation({
    summary: '更新资源',
    description: '更新系统资源信息'
  })
  @ApiRaxResponse({
    description: '更新成功',
    type: SysResource
  })
  @Post('resource/edit')
  async updateResource(@Body() updateResourceDto: UpdateResourceDto): Promise<SysResource> {
    return await this.permissionService.updateResource(updateResourceDto);
  }

  @ApiOperation({
    summary: '删除资源',
    description: '软删除系统资源'
  })
  @ApiParam({
    name: 'id',
    description: '资源ID',
    type: Number
  })
  @ApiRaxResponse({
    description: '删除成功',
    type: Boolean
  })
  @Get('resource/remove/:id')
  async deleteResource(@Param('id') id: string): Promise<boolean> {
    const idNum = parseInt(id);
    if (isNaN(idNum)) {
      throw new RaxBizException('资源ID必须是数字');
    }
    return await this.permissionService.deleteResource(idNum);
  }

  @ApiOperation({
    summary: '获取资源详情',
    description: '根据ID获取资源详细信息'
  })
  @ApiParam({
    name: 'id',
    description: '资源ID',
    type: Number
  })
  @ApiRaxResponse({
    description: '获取成功',
    type: SysResource
  })
  @Get('resource/get/:id')
  async findResourceById(@Param('id') id: string): Promise<SysResource> {
    const idNum = parseInt(id);
    if (isNaN(idNum)) {
      throw new RaxBizException('资源ID必须是数字');
    }
    return await this.permissionService.findResourceById(idNum);
  }

  @ApiOperation({
    summary: '根据父级ID查询子资源',
    description: '根据父级资源ID查询下级资源列表'
  })
  @ApiParam({
    name: 'parentId',
    description: '父级资源ID. 0表示查询顶级资源',
    type: Number
  })
  @ApiRaxResponse({
    description: '查询成功',
    type: SysResource,
    isArray: true
  })
  @Get('resource/children/:parentId')
  async findChildrenResourcePage(@Param('parentId') parentId: string): Promise<SysResource[]> {
    const parentIdNum = parseInt(parentId);
    if (isNaN(parentIdNum)) {
      throw new RaxBizException('父级资源ID必须是数字');
    }
    return await this.permissionService.findChildrenResourcePage(parentIdNum);
  }

  @ApiOperation({
    summary: '获取所有资源树',
    description: '获取所有资源的树形结构'
  })
  @ApiRaxResponse({
    description: '获取成功',
    type: SysResource,
    isArray: true
  })
  @Get('resource/tree')
  async getAllResourcesTree(): Promise<SysResource[]> {
    return await this.permissionService.getAllResourcesTree();
  }
} 