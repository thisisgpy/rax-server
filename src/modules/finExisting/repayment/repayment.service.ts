import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FinExistingRepaymentPlan } from '../../../entities/finExistingRepaymentPlan.entity';
import { FinExistingRepaymentPlanItem } from '../../../entities/finExistingRepaymentPlanItem.entity';
import { FinExistingRepaymentRecord } from '../../../entities/finExistingRepaymentRecord.entity';
import { SNOWFLAKE } from '../../../common/providers';
import { Snowflake } from '../../../common/utils/snowflake';
import { UserContext } from '../../../common/context/user-context';

@Injectable()
export class RepaymentService {
  constructor(
    @InjectRepository(FinExistingRepaymentPlan)
    private readonly repaymentPlanRepository: Repository<FinExistingRepaymentPlan>,
    @InjectRepository(FinExistingRepaymentPlanItem)
    private readonly repaymentPlanItemRepository: Repository<FinExistingRepaymentPlanItem>,
    @InjectRepository(FinExistingRepaymentRecord)
    private readonly repaymentRecordRepository: Repository<FinExistingRepaymentRecord>,
    @Inject(SNOWFLAKE)
    private readonly snowflake: Snowflake,
    @Inject('UserContext')
    private readonly userContext: UserContext
  ) {}

  // TODO: 后续添加具体的业务方法
} 