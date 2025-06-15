import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssetFixed } from '../../entities/assetFixed.entity';
import { SysOrg } from '../../entities/sysOrg.entity';
import { AssetFixedController } from './assetFixed.controller';
import { AssetFixedService } from './assetFixed.service';
import { ContextModule } from '../../common/context/context.module';
import { SnowflakeModule } from '../../common/providers/snowflake.module';
import { LoggerModule } from '../../common/logger/logger.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([AssetFixed, SysOrg]),
        ContextModule,        // UserContext - REQUIRED
        SnowflakeModule,      // ID generator - REQUIRED  
        LoggerModule,         // Logging service - REQUIRED
    ],
    controllers: [AssetFixedController],
    providers: [AssetFixedService],
    exports: [AssetFixedService]
})
export class AssetFixedModule {} 