import { Controller, Get, Post, Body, Param, ParseIntPipe } from '@nestjs/common';
import { FinExistingService } from './finExisting.service';
import { CreateFinExistingDto } from './dto/create-fin-existing.dto';
import { UpdateFinExistingDto } from './dto/update-fin-existing.dto';
import { QueryFinExistingDto } from './dto/query-fin-existing.dto';
import { FinExistingResponseDto, FinExistingListItemDto } from './dto/fin-existing-response.dto';
import { FinExisting } from '../../entities/finExisting.entity';
import { PageResult } from '../../common/entities/page.entity';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { ApiRaxResponse } from '../../common/decorators/api-response.decorator';
import { RaxBizException } from '../../common/exceptions/rax-biz.exception';

@ApiTags('存量融资管理')
@Controller('/api/v1/fin/existing')
export class FinExistingController {
    constructor(private readonly finExistingService: FinExistingService) {}

    @ApiOperation({
        summary: '创建存量融资',
        description: '创建存量融资，同时创建放款记录、担保记录和勾稽关系'
    })
    @ApiRaxResponse({
        description: '创建成功',
        type: FinExisting
    })
    @Post('create')
    async create(@Body() createFinExistingDto: CreateFinExistingDto): Promise<FinExisting> {
        try {
            return await this.finExistingService.create(createFinExistingDto);
        } catch (error) {
            if (error instanceof RaxBizException) {
                throw error;
            }
            throw new RaxBizException(`创建存量融资失败: ${error.message}`);
        }
    }

    @ApiOperation({
        summary: '编辑存量融资',
        description: '编辑存量融资基本信息，融资总额字段不允许编辑'
    })
    @ApiRaxResponse({
        description: '编辑成功',
        type: FinExisting
    })
    @Post('edit')
    async update(@Body() updateFinExistingDto: UpdateFinExistingDto): Promise<FinExisting> {
        try {
            return await this.finExistingService.update(updateFinExistingDto);
        } catch (error) {
            if (error instanceof RaxBizException) {
                throw error;
            }
            throw new RaxBizException(`编辑存量融资失败: ${error.message}`);
        }
    }

    @ApiOperation({
        summary: '删除存量融资',
        description: '逻辑删除存量融资，不对关联数据进行删除'
    })
    @ApiParam({
        name: 'id',
        description: '存量融资ID',
        type: Number
    })
    @ApiRaxResponse({
        description: '删除成功'
    })
    @Get('remove/:id')
    async remove(@Param('id', ParseIntPipe) id: number): Promise<boolean> {
        try {
            return await this.finExistingService.delete(id);
        } catch (error) {
            if (error instanceof RaxBizException) {
                throw error;
            }
            throw new RaxBizException(`删除存量融资失败: ${error.message}`);
        }
    }

    @ApiOperation({
        summary: '查询存量融资详情',
        description: '根据ID查询存量融资详情，包含完整的基本信息和组织信息'
    })
    @ApiParam({
        name: 'id',
        description: '存量融资ID',
        type: Number
    })
    @ApiRaxResponse({
        description: '查询成功',
        type: FinExistingResponseDto
    })
    @Get('get/:id')
    async findById(@Param('id', ParseIntPipe) id: number): Promise<FinExistingResponseDto> {
        try {
            return await this.finExistingService.findById(id);
        } catch (error) {
            if (error instanceof RaxBizException) {
                throw error;
            }
            throw new RaxBizException(`查询存量融资详情失败: ${error.message}`);
        }
    }

    @ApiOperation({
        summary: '多条件分页查询融资列表',
        description: '支持多种条件的分页查询，包括融资主体、融资方式、金融机构、金额范围、利率范围、期限范围、到期日范围等条件筛选'
    })
    @ApiRaxResponse({
        description: '查询成功',
        type: PageResult
    })
    @Post('list')
    async findPage(@Body() queryFinExistingDto: QueryFinExistingDto): Promise<PageResult<FinExistingListItemDto>> {
        try {
            return await this.finExistingService.findPage(queryFinExistingDto);
        } catch (error) {
            if (error instanceof RaxBizException) {
                throw error;
            }
            throw new RaxBizException(`分页查询存量融资失败: ${error.message}`);
        }
    }
} 