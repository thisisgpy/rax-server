import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FinExistingDisbursement } from '../../../entities/finExistingDisbursement.entity';
import { SNOWFLAKE } from '../../../common/providers';
import { Snowflake } from '../../../common/utils/snowflake';
import { UserContext } from '../../../common/context/user-context';

@Injectable()
export class DisbursementService {
  constructor(
    @InjectRepository(FinExistingDisbursement)
    private readonly disbursementRepository: Repository<FinExistingDisbursement>,
    @Inject(SNOWFLAKE)
    private readonly snowflake: Snowflake,
    @Inject('UserContext')
    private readonly userContext: UserContext
  ) {}

  // TODO: 后续添加具体的业务方法
} 