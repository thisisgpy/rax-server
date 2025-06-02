import { Provider } from '@nestjs/common';
import { Snowflake } from '../utils/snowflake';

export const SNOWFLAKE = 'SNOWFLAKE';

export const SnowflakeProvider: Provider = {
  provide: SNOWFLAKE,
  useFactory: () => {
    return new Snowflake(BigInt(process.env.SNOWFLAKE_WORKER_ID || '1'));
  },
}; 