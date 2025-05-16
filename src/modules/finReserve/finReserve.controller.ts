import { Body, Controller, Post, Get, Param } from '@nestjs/common';
import { FinReserveService } from './finReserve.service';
import { CreateReserveDto } from './dto/create-reserve.dto';
import { UpdateReserveDto } from './dto/update-reserve.dto';
import { CancelReserveDto } from './dto/cancel-reserve.dto';
import { ConfirmProgressDto } from './dto/confirm-progress.dto';
import { CreateProgressReportDto } from './dto/create-progress-report.dto';
import { ReserveDetailResponseDto } from './dto/reserve-detail.dto';
import { FinReserve } from 'src/entities/finReserve.entity';
import { FinReserveProgress } from 'src/entities/finReserveProgress.entity';
import { FinReserveProgressReport } from 'src/entities/finReserveProgressReport.entity';
import { SearchReserveDto } from './dto/search-reserve.dto';
import { ReserveListItemDto } from './dto/reserve-list.dto';
import { PageResult } from '../../common/entities/page.entity';
import { ConfigService } from '../../common/config/config.service';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('储备融资')
@Controller('api/v1/reserve')
export class FinReserveController {
  constructor(
    private readonly finReserveService: FinReserveService,
    private readonly configService: ConfigService,
  ) {}

  @ApiOperation({ summary: '创建储备融资' })
  @ApiBody({ type: CreateReserveDto })
  @ApiResponse({
    status: 200,
    description: '创建成功',
    type: FinReserve
  })
  @Post('create')
  async create(@Body() createReserveDto: CreateReserveDto): Promise<FinReserve> {
    return await this.finReserveService.create(createReserveDto);
  }

  @ApiOperation({ summary: '更新储备融资' })
  @ApiBody({ type: UpdateReserveDto })
  @ApiResponse({
    status: 200,
    description: '更新成功',
    type: Boolean
  })
  @Post('edit')
  async update(@Body() updateReserveDto: UpdateReserveDto): Promise<boolean> {
    return await this.finReserveService.update(updateReserveDto);
  }

  @ApiOperation({ summary: '取消储备融资' })
  @ApiBody({ type: CancelReserveDto })
  @ApiResponse({
    status: 200,
    description: '取消成功',
    type: Boolean
  })
  @Post('cancel')
  async cancel(@Body() cancelReserveDto: CancelReserveDto): Promise<boolean> {
    return await this.finReserveService.cancel(
      cancelReserveDto.id,
      cancelReserveDto.cancelReason
    );
  }

  @ApiOperation({ summary: '删除储备融资' })
  @ApiParam({
    name: 'id',
    description: '储备融资ID',
    required: true,
    type: String
  })
  @ApiResponse({
    status: 200,
    description: '删除成功',
    type: Boolean
  })
  @Get('remove/:id')
  async delete(@Param('id') id: string): Promise<boolean> {
    return await this.finReserveService.delete(id);
  }

  @ApiOperation({ summary: '查询储备融资详情' })
  @ApiParam({
    name: 'id',
    description: '储备融资ID',
    required: true,
    type: String
  })
  @ApiResponse({
    status: 200,
    description: '查询成功',
    type: ReserveDetailResponseDto
  })
  @Get('get/:id')
  async findDetail(@Param('id') id: string): Promise<ReserveDetailResponseDto> {
    return await this.finReserveService.findDetail(id);
  }

  @ApiOperation({ summary: '确认进度完成' })
  @ApiBody({ type: ConfirmProgressDto })
  @ApiResponse({
    status: 200,
    description: '确认成功',
    type: Boolean
  })
  @Post('progress/confirm')
  async confirmProgress(@Body() confirmProgressDto: ConfirmProgressDto): Promise<boolean> {
    return await this.finReserveService.confirmProgress(confirmProgressDto);
  }

  @ApiOperation({ summary: '查询进度列表' })
  @ApiParam({
    name: 'id',
    description: '储备融资ID',
    required: true,
    type: String
  })
  @ApiResponse({
    status: 200,
    description: '查询成功',
    type: [FinReserveProgress]
  })
  @Get('progress/list/:id')
  async findProgressList(@Param('id') id: string): Promise<FinReserveProgress[]> {
    return await this.finReserveService.findProgressList(id);
  }

  @ApiOperation({ summary: '提交进度报告' })
  @ApiBody({ type: CreateProgressReportDto })
  @ApiResponse({
    status: 200,
    description: '提交成功',
    type: Boolean
  })
  @Post('progress/report')
  async createProgressReport(
    @Body() createProgressReportDto: CreateProgressReportDto
  ): Promise<boolean> {
    return await this.finReserveService.createProgressReport(createProgressReportDto);
  }

  @ApiOperation({ summary: '查询进度报告列表' })
  @ApiParam({
    name: 'id',
    description: '储备融资ID',
    required: true,
    type: String
  })
  @ApiResponse({
    status: 200,
    description: '查询成功',
    type: [FinReserveProgressReport]
  })
  @Get('progress/report/list/:id')
  async findProgressReports(@Param('id') id: string): Promise<FinReserveProgressReport[]> {
    return await this.finReserveService.findProgressReports(id);
  }

  @ApiOperation({ summary: '分页搜索储备融资' })
  @ApiBody({ type: SearchReserveDto })
  @ApiResponse({
    status: 200,
    description: '查询成功',
    type: PageResult<ReserveListItemDto>
  })
  @Post('search')
  async search(@Body() searchDto: SearchReserveDto): Promise<PageResult<ReserveListItemDto>> {
    return await this.finReserveService.search(searchDto);
  }

  @ApiOperation({ summary: '获取进度步骤配置' })
  @ApiResponse({
    status: 200,
    description: '查询成功',
    type: [String]
  })
  @Get('progress/steps')
  async getProgressSteps(): Promise<string[]> {
    return this.configService.getReserveProgressSteps();
  }
} 