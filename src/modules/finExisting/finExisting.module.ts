import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FinExistingController } from './finExisting.controller';
import { FinExistingService } from './finExisting.service';
import { FinExisting } from '../../entities/fin-existing.entity';
import { FinExistingDisbursement } from '../../entities/fin-existing-disbursement.entity';
import { FinExistingRepayment } from '../../entities/fin-existing-repayment.entity';
import { FinExistingGuarantee } from '../../entities/fin-existing-guarantee.entity';
import { FinExistingGuaranteeAsset } from '../../entities/fin-existing-guarantee-asset.entity';
import { FinExistingLinkage } from '../../entities/fin-existing-linkage.entity';
import { FinExistingDisbursementRepaymentRel } from '../../entities/fin-existing-disbursement-repayment-rel.entity';
import { ContextModule } from '../../common/context/context.module';
import { SnowflakeModule } from '../../common/providers/snowflake.module';
import { ConfigModule } from '../../common/config/config.module';
import { FinExistingConverter } from './converters/fin-existing.converter';
import { FinExistingValidator } from './validators/fin-existing.validator';
import { GuaranteeHelper } from './helpers/guarantee.helper';
import { FinExistingFactory } from './factories/fin-existing.factory';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      FinExisting,
      FinExistingDisbursement,
      FinExistingRepayment,
      FinExistingGuarantee,
      FinExistingGuaranteeAsset,
      FinExistingLinkage,
      FinExistingDisbursementRepaymentRel,
    ]),
    ContextModule,
    SnowflakeModule,
    ConfigModule,
  ],
  controllers: [FinExistingController],
  providers: [
    FinExistingService,
    FinExistingConverter,
    FinExistingValidator,
    GuaranteeHelper,
    FinExistingFactory,
  ],
  exports: [FinExistingService],
})
export class FinExistingModule {} 