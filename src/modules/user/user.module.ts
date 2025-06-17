import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { SysUser } from '../../entities/sysUser.entity';
import { SysOrg } from '../../entities/sysOrg.entity';
import { SnowflakeModule } from '../../common/providers/snowflake.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([SysUser, SysOrg]),
        SnowflakeModule
    ],
    controllers: [UserController],
    providers: [
        UserService,
        {
            provide: 'UserContext',
            useValue: {
                getUsername: () => 'admin' // 临时实现，后续会在认证模块中完善
            }
        }
    ],
    exports: [UserService]
})
export class UserModule {} 