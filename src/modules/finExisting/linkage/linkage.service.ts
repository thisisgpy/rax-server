import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FinExistingLinkage } from '../../../entities/finExistingLinkage.entity';
import { SNOWFLAKE } from '../../../common/providers';
import { Snowflake } from '../../../common/utils/snowflake';
import { UserContext } from '../../../common/context/user-context';

@Injectable()
export class LinkageService {
  constructor(
    @InjectRepository(FinExistingLinkage)
    private readonly linkageRepository: Repository<FinExistingLinkage>,
    @Inject(SNOWFLAKE)
    private readonly snowflake: Snowflake,
    @Inject('UserContext')
    private readonly userContext: UserContext
  ) {}

  // TODO: 后续添加具体的业务方法
} 