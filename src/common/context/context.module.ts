import { Global, Module } from '@nestjs/common';
import { UserContext } from './user-context';

@Global()
@Module({
    providers: [
        {
            provide: 'UserContext',
            useClass: UserContext,
        },
    ],
    exports: ['UserContext'],
})
export class ContextModule {} 