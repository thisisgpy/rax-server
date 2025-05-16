import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FinReserve } from '../../entities/finReserve.entity';
import { FinReserveCosts } from '../../entities/finReserveCosts.entity';
import { FinReserveProgress } from '../../entities/finReserveProgress.entity';
import { FinReserveProgressReport } from '../../entities/finReserveProgressReport.entity';
import { FinReserveController } from './finReserve.controller';
import { FinReserveService } from './finReserve.service';
import { ContextModule } from '../../common/context/context.module';
import { SnowflakeModule } from '../../common/providers/snowflake.module';
import { ConfigModule } from '../../common/config/config.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      FinReserve,
      FinReserveCosts,
      FinReserveProgress,
      FinReserveProgressReport,
    ]),
    ContextModule,
    SnowflakeModule,
    ConfigModule,
  ],
  controllers: [FinReserveController],
  providers: [FinReserveService],
  exports: [FinReserveService],
})
export class FinReserveModule {} 