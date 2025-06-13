import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { SysRole } from '../../entities/sysRole.entity';
import { SnowflakeModule } from '../../common/providers/snowflake.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([SysRole]),
        SnowflakeModule
    ],
    controllers: [RoleController],
    providers: [
        RoleService,
        {
            provide: 'UserContext',
            useValue: {
                getUsername: () => 'admin'
            }
        }
    ],
    exports: [RoleService]
})
export class RoleModule {} 