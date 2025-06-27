import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FinExistingGuarantee } from '../../../entities/finExistingGuarantee.entity';
import { FinExistingGuaranteeAsset } from '../../../entities/finExistingGuaranteeAsset.entity';
import { SNOWFLAKE } from '../../../common/providers';
import { Snowflake } from '../../../common/utils/snowflake';
import { UserContext } from '../../../common/context/user-context';

@Injectable()
export class GuaranteeService {
  constructor(
    @InjectRepository(FinExistingGuarantee)
    private readonly guaranteeRepository: Repository<FinExistingGuarantee>,
    @InjectRepository(FinExistingGuaranteeAsset)
    private readonly guaranteeAssetRepository: Repository<FinExistingGuaranteeAsset>,
    @Inject(SNOWFLAKE)
    private readonly snowflake: Snowflake,
    @Inject('UserContext')
    private readonly userContext: UserContext
  ) {}

  // TODO: 后续添加具体的业务方法
} 