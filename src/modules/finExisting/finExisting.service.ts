import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FinExisting } from '../../entities/finExisting.entity';
import { SNOWFLAKE } from '../../common/providers';
import { Snowflake } from '../../common/utils/snowflake';
import { UserContext } from '../../common/context/user-context';

@Injectable()
export class FinExistingService {
  constructor(
    @InjectRepository(FinExisting)
    private readonly finExistingRepository: Repository<FinExisting>,
    @Inject(SNOWFLAKE)
    private readonly snowflake: Snowflake,
    @Inject('UserContext')
    private readonly userContext: UserContext
  ) {}

  // TODO: 后续添加具体的业务方法
} 