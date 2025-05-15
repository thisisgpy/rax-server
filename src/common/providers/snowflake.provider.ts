import { Provider } from '@nestjs/common';
import { Snowflake } from '../utils/snowflake';

export const SNOWFLAKE = 'SNOWFLAKE';

export const SnowflakeProvider: Provider = {
  provide: SNOWFLAKE,
  useFactory: () => {
    return new Snowflake(1n, 1n);
  },
}; 