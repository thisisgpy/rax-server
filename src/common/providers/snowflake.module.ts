import { Global, Module } from '@nestjs/common';
import { SnowflakeProvider } from './snowflake.provider';

@Global()
@Module({
    providers: [SnowflakeProvider],
    exports: [SnowflakeProvider],
})
export class SnowflakeModule {} 