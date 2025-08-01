import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FinExistingController } from './finExisting.controller';
import { FinExistingService } from './finExisting.service';
import { FinExisting } from '../../entities/finExisting.entity';
import { FinExistingDisbursement } from '../../entities/finExistingDisbursement.entity';
import { FinExistingGuarantee } from '../../entities/finExistingGuarantee.entity';
import { FinExistingGuaranteeAsset } from '../../entities/finExistingGuaranteeAsset.entity';
import { FinExistingLinkage } from '../../entities/finExistingLinkage.entity';
import { SysOrg } from '../../entities/sysOrg.entity';
import { LoggerModule } from '../../common/logger/logger.module';
import { ContextModule } from '../../common/context/context.module';
import { SnowflakeModule } from '../../common/providers/snowflake.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            FinExisting,
            FinExistingDisbursement,
            FinExistingGuarantee,
            FinExistingGuaranteeAsset,
            FinExistingLinkage,
            SysOrg
        ]),
        LoggerModule,
        ContextModule,
        SnowflakeModule
    ],
    controllers: [FinExistingController],
    providers: [FinExistingService],
    exports: [FinExistingService]
})
export class FinExistingModule {} 