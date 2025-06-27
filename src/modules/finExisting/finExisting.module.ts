import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FinExistingController } from './finExisting.controller';
import { FinExistingService } from './finExisting.service';
import { FinExisting } from '../../entities/finExisting.entity';
import { FinExistingDisbursement } from '../../entities/finExistingDisbursement.entity';
import { FinExistingRepaymentPlan } from '../../entities/finExistingRepaymentPlan.entity';
import { FinExistingRepaymentPlanItem } from '../../entities/finExistingRepaymentPlanItem.entity';
import { FinExistingRepaymentRecord } from '../../entities/finExistingRepaymentRecord.entity';
import { FinExistingDisbursementRepaymentPlanRel } from '../../entities/finExistingDisbursementRepaymentPlanRel.entity';
import { FinExistingGuarantee } from '../../entities/finExistingGuarantee.entity';
import { FinExistingGuaranteeAsset } from '../../entities/finExistingGuaranteeAsset.entity';
import { FinExistingLinkage } from '../../entities/finExistingLinkage.entity';

// 分模块导入服务和控制器
import { DisbursementController } from './disbursement/disbursement.controller';
import { DisbursementService } from './disbursement/disbursement.service';
import { RepaymentController } from './repayment/repayment.controller';
import { RepaymentService } from './repayment/repayment.service';
import { GuaranteeController } from './guarantee/guarantee.controller';
import { GuaranteeService } from './guarantee/guarantee.service';
import { LinkageController } from './linkage/linkage.controller';
import { LinkageService } from './linkage/linkage.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      FinExisting,
      FinExistingDisbursement,
      FinExistingRepaymentPlan,
      FinExistingRepaymentPlanItem,
      FinExistingRepaymentRecord,
      FinExistingDisbursementRepaymentPlanRel,
      FinExistingGuarantee,
      FinExistingGuaranteeAsset,
      FinExistingLinkage,
    ]),
  ],
  controllers: [
    FinExistingController,
    DisbursementController,
    RepaymentController,
    GuaranteeController,
    LinkageController,
  ],
  providers: [
    FinExistingService,
    DisbursementService,
    RepaymentService,
    GuaranteeService,
    LinkageService,
  ],
  exports: [
    FinExistingService,
    DisbursementService,
    RepaymentService,
    GuaranteeService,
    LinkageService,
  ],
})
export class FinExistingModule {} 