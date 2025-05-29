import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { FinExistingService } from './finExisting.service';
import { CreateFinExistingDto } from './dto/create-fin-existing.dto';
import { UpdateFinExistingDto } from './dto/update-fin-existing.dto';
import { SearchFinExistingDto } from './dto/search-fin-existing.dto';
import { FinExistingListItemDto } from './dto/fin-existing-list.dto';
import { CreateFinExistingGuaranteeDto } from './dto/create-fin-existing-guarantee.dto';
import { UpdateFinExistingGuaranteeDto } from './dto/update-fin-existing-guarantee.dto';
import { FinExistingGuaranteeDto } from './dto/fin-existing-guarantee.dto';
import { ApiRaxResponse } from 'src/common/decorators/api-response.decorator';
import { PageResult } from 'src/common/entities/page.entity';

@ApiTags('存量融资管理')
@Controller('api/v1/fin/existing')
export class FinExistingController {
  constructor(private readonly finExistingService: FinExistingService) {}

  @Post('create')
  @ApiOperation({ 
    summary: '创建存量融资',
    description: '创建新的存量融资记录，包含基本信息和利率还款信息。金额以万元为单位输入，支持6位小数。新增支持回报利率、还款周期、还款方式、利息类型、基准利率、基点、计息基准等字段。回报利率、基准利率、基点为数字类型，支持4位小数。'
  })
  @ApiBody({ type: CreateFinExistingDto })
  @ApiRaxResponse({
    description: '创建成功，返回存量融资ID',
    type: String
  })
  async createFinExisting(
    @Body() createDto: CreateFinExistingDto,
  ): Promise<string> {
    return this.finExistingService.createFinExisting(createDto);
  }

  @Post('edit')
  @ApiOperation({ 
    summary: '更新存量融资',
    description: '更新存量融资记录的所有字段。包含业务规则验证：1.如果已有多条放款记录，不能修改为单次放款；2.融资总额不能小于已放款总金额。金额以万元为单位输入，支持6位小数。支持更新利率还款相关字段。回报利率、基准利率、基点为字符串类型，整数部分和小数部分分别最长为4位。'
  })
  @ApiBody({ type: UpdateFinExistingDto })
  @ApiRaxResponse({
    description: '更新成功',
    type: Boolean
  })
  async updateFinExisting(
    @Body() updateDto: UpdateFinExistingDto,
  ): Promise<boolean> {
    return this.finExistingService.updateFinExisting(updateDto);
  }

  @Get('get/:id')
  @ApiOperation({ 
    summary: '根据ID获取存量融资详情',
    description: '根据存量融资ID查询存量融资的基本信息和利率还款信息。不包含已删除的记录。金额以分为单位返回。回报利率、基准利率、基点以字符串类型返回。'
  })
  @ApiParam({ name: 'id', description: '存量融资ID' })
  @ApiRaxResponse({
    description: '查询成功，返回存量融资详情',
    type: FinExistingListItemDto
  })
  async getFinExistingById(
    @Param('id') id: string,
  ): Promise<FinExistingListItemDto> {
    return this.finExistingService.getFinExistingById(id);
  }

  @Get('remove/:id')
  @ApiOperation({ 
    summary: '删除存量融资',
    description: '软删除存量融资记录，只将is_deleted标记为true，不对关联数据进行操作。已删除的记录不能重复删除。'
  })
  @ApiParam({ name: 'id', description: '存量融资ID' })
  @ApiRaxResponse({
    description: '删除成功',
    type: Boolean
  })
  async removeFinExisting(
    @Param('id') id: string,
  ): Promise<boolean> {
    return this.finExistingService.removeFinExisting(id);
  }

  @Post('search')
  @ApiOperation({ 
    summary: '多条件分页搜索存量融资',
    description: '支持多种搜索条件：编码（等值）、融资主体ID（等值）、融资名称（模糊）、融资结构（等值）、融资方式（等值）、金融机构（模糊）、融资总额（范围，万元）、是否多次放款（等值）、融资期限（范围）、是否公开融资（等值）、还款周期（等值）、还款方式（等值）、利息类型（等值）。支持分页，默认第1页，每页10条。回报利率、基准利率、基点以数字类型返回。'
  })
  @ApiBody({ type: SearchFinExistingDto })
  @ApiRaxResponse({
    description: '搜索成功，返回分页结果',
    type: FinExistingListItemDto,
    isArray: true
  })
  async searchFinExisting(
    @Body() searchDto: SearchFinExistingDto,
  ): Promise<PageResult<FinExistingListItemDto>> {
    return this.finExistingService.searchFinExisting(searchDto);
  }

  // ==================== 融资担保相关接口 ====================

  @Post('guarantee/create')
  @ApiOperation({ 
    summary: '新增融资担保记录',
    description: '创建新的融资担保记录，包含担保基本信息、反担保记录和担保物关系。每次只能新增一条融资担保记录。一条融资担保记录下可以有多条反担保记录和多个担保物记录。保证金以万元为单位输入，支持6位小数。支持在创建时同时创建反担保记录。'
  })
  @ApiBody({ type: CreateFinExistingGuaranteeDto })
  @ApiRaxResponse({
    description: '创建成功，返回完整的融资担保记录',
    type: FinExistingGuaranteeDto
  })
  async createGuarantee(
    @Body() createDto: CreateFinExistingGuaranteeDto,
  ): Promise<FinExistingGuaranteeDto> {
    return this.finExistingService.createGuarantee(createDto);
  }

  @Post('guarantee/edit')
  @ApiOperation({ 
    summary: '编辑融资担保记录',
    description: '更新融资担保记录的所有字段。担保记录的所有字段都可以编辑。支持部分字段更新。保证金以万元为单位输入，支持6位小数。支持同时更新反担保记录，传入的反担保数组将完全替换现有的反担保记录。'
  })
  @ApiBody({ type: UpdateFinExistingGuaranteeDto })
  @ApiRaxResponse({
    description: '更新成功，返回更新后的完整的融资担保记录',
    type: FinExistingGuaranteeDto
  })
  async updateGuarantee(
    @Body() updateDto: UpdateFinExistingGuaranteeDto,
  ): Promise<FinExistingGuaranteeDto> {
    return this.finExistingService.updateGuarantee(updateDto);
  }

  @Get('guarantee/remove/:id')
  @ApiOperation({ 
    summary: '删除融资担保记录',
    description: '删除融资担保记录时，会同时删除反担保记录和担保物记录。'
  })
  @ApiParam({ name: 'id', description: '融资担保ID' })
  @ApiRaxResponse({
    description: '删除成功',
    type: Boolean
  })
  async removeGuarantee(
    @Param('id') id: string,
  ): Promise<boolean> {
    return this.finExistingService.removeGuarantee({ id });
  }

  @Get('guarantee/get/:id')
  @ApiOperation({ 
    summary: '根据融资担保记录ID查询融资担保详情',
    description: '查询融资担保记录时，要同时查询反担保记录和担保物记录（只查询ID，不需要查询详情）。保证金以分为单位返回。'
  })
  @ApiParam({ name: 'id', description: '融资担保ID' })
  @ApiRaxResponse({
    description: '查询成功，返回完整的融资担保记录',
    type: FinExistingGuaranteeDto
  })
  async getGuaranteeById(
    @Param('id') id: string,
  ): Promise<FinExistingGuaranteeDto> {
    return this.finExistingService.getGuaranteeById(id);
  }

  @Get('guarantee/list/:existingId')
  @ApiOperation({ 
    summary: '根据存量融资ID查询所有的融资担保记录',
    description: '查询融资担保记录时，要同时查询反担保记录和担保物记录（只查询ID，不需要查询详情）。保证金以分为单位返回。'
  })
  @ApiParam({ name: 'existingId', description: '存量融资ID' })
  @ApiRaxResponse({
    description: '查询成功，返回完整的融资担保记录数组',
    type: FinExistingGuaranteeDto,
    isArray: true
  })
  async getGuaranteesByExistingId(
    @Param('existingId') existingId: string,
  ): Promise<FinExistingGuaranteeDto[]> {
    return this.finExistingService.getGuaranteesByExistingId(existingId);
  }
}