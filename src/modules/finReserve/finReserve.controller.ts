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

@Controller('api/v1/reserve')
export class FinReserveController {
  constructor(
    private readonly finReserveService: FinReserveService,
    private readonly configService: ConfigService,
  ) {}

  @Post('create')
  async create(@Body() createReserveDto: CreateReserveDto): Promise<FinReserve> {
    return await this.finReserveService.create(createReserveDto);
  }

  @Post('edit')
  async update(@Body() updateReserveDto: UpdateReserveDto): Promise<boolean> {
    return await this.finReserveService.update(updateReserveDto);
  }

  @Post('cancel')
  async cancel(@Body() cancelReserveDto: CancelReserveDto): Promise<boolean> {
    return await this.finReserveService.cancel(
      cancelReserveDto.id,
      cancelReserveDto.cancelReason
    );
  }

  @Get('remove/:id')
  async delete(@Param('id') id: string): Promise<boolean> {
    return await this.finReserveService.delete(id);
  }

  @Get('get/:id')
  async findDetail(@Param('id') id: string): Promise<ReserveDetailResponseDto> {
    return await this.finReserveService.findDetail(id);
  }

  @Post('progress/confirm')
  async confirmProgress(@Body() confirmProgressDto: ConfirmProgressDto): Promise<boolean> {
    return await this.finReserveService.confirmProgress(confirmProgressDto);
  }

  @Get('progress/list/:id')
  async findProgressList(@Param('id') id: string): Promise<FinReserveProgress[]> {
    return await this.finReserveService.findProgressList(id);
  }

  @Post('progress/report')
  async createProgressReport(
    @Body() createProgressReportDto: CreateProgressReportDto
  ): Promise<boolean> {
    return await this.finReserveService.createProgressReport(createProgressReportDto);
  }

  @Get('progress/report/list/:id')
  async findProgressReports(@Param('id') id: string): Promise<FinReserveProgressReport[]> {
    return await this.finReserveService.findProgressReports(id);
  }

  @Post('search')
  async search(@Body() searchDto: SearchReserveDto): Promise<PageResult<ReserveListItemDto>> {
    return await this.finReserveService.search(searchDto);
  }

  @Get('progress/steps')
  async getProgressSteps(): Promise<string[]> {
    return this.configService.getReserveProgressSteps();
  }
} 