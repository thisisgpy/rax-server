import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUserDto } from './dto/query-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { SysUser } from '../../entities/sysUser.entity';
import { PageResult } from '../../common/entities/page.entity';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { ApiRaxResponse } from '../../common/decorators/api-response.decorator';
import { RaxBizException } from '../../common/exceptions/rax-biz.exception';
import { ChangePasswordDto } from './dto/change-password.dto';

@ApiTags('用户管理')
@Controller('api/v1/user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @ApiOperation({
        summary: '创建用户',
        description: '创建新用户'
    })
    @ApiRaxResponse({
        description: '创建成功',
        type: SysUser
    })
    @Post('create')
    async create(@Body() createUserDto: CreateUserDto): Promise<SysUser> {
        const user = await this.userService.create(createUserDto);
        user.password = ''
        return user;
    }

    @ApiOperation({
        summary: '更新用户',
        description: '更新用户信息'
    })
    @ApiRaxResponse({
        description: '更新成功',
        type: SysUser
    })
    @Post('edit')
    async update(@Body() updateUserDto: UpdateUserDto): Promise<SysUser> {
        const user = await this.userService.update(updateUserDto);
        user.password = ''
        return user;
    }

    @ApiOperation({
        summary: '删除用户',
        description: '软删除用户'
    })
    @ApiParam({
        name: 'id',
        description: '用户ID',
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
            throw new RaxBizException('用户ID必须是数字');
        }
        return await this.userService.delete(idNum);
    }

    @ApiOperation({
        summary: '获取用户详情',
        description: '根据ID获取用户详细信息'
    })
    @ApiParam({
        name: 'id',
        description: '用户ID',
        type: Number
    })
    @ApiRaxResponse({
        description: '获取成功',
        type: UserResponseDto
    })
    @Get('get/:id')
    async findById(@Param('id') id: string): Promise<UserResponseDto> {
        const idNum = parseInt(id);
        if (isNaN(idNum)) {
            throw new RaxBizException('用户ID必须是数字');
        }
        return await this.userService.findById(idNum);
    }

    @ApiOperation({
        summary: '分页查询用户',
        description: '根据条件分页查询用户列表'
    })
    @ApiRaxResponse({
        description: '查询成功',
        type: PageResult<UserResponseDto>
    })
    @Post('list')
    async findPage(@Body() queryDto: QueryUserDto): Promise<PageResult<UserResponseDto>> {
        return await this.userService.findPage(queryDto);
    }

    @ApiOperation({
        summary: '重置用户密码',
        description: '管理员重置用户密码'
    })
    @ApiParam({
        name: 'id',
        description: '用户ID',
        type: Number
    })
    @ApiRaxResponse({
        description: '重置成功',
        type: Boolean
    })
    @Get('reset-password/:id')
    async resetPassword(@Param('id') id: string): Promise<boolean> {
        const idNum = parseInt(id);
        if (isNaN(idNum)) {
            throw new RaxBizException('用户ID必须是数字');
        }
        return await this.userService.resetPassword(idNum);
    }

    @ApiOperation({
        summary: '修改密码',
        description: '用户修改自己的密码'
    })
    @ApiParam({
        name: 'id',
        description: '用户ID',
        type: Number
    })
    @ApiRaxResponse({
        description: '修改成功',
        type: Boolean
    })
    @Post('change-password')
    async changePassword(@Body() changePasswordDto: ChangePasswordDto): Promise<boolean> {
        return await this.userService.changePassword(changePasswordDto.id, changePasswordDto.oldPassword, changePasswordDto.newPassword);
    }
} 