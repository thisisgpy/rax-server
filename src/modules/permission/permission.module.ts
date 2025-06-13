import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionService } from './permission.service';
import { PermissionController } from './permission.controller';
import { SysUserRole } from '../../entities/sysUserRole.entity';
import { SysRoleResource } from '../../entities/sysRoleResource.entity';
import { SysRole } from '../../entities/sysRole.entity';
import { SysResource } from '../../entities/sysResource.entity';
import { SnowflakeModule } from '../../common/providers/snowflake.module';
import { UserModule } from '../user/user.module';
import { RoleModule } from '../role/role.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([SysUserRole, SysRoleResource, SysRole, SysResource]),
        SnowflakeModule,
        forwardRef(() => UserModule),
        forwardRef(() => RoleModule)
    ],
    controllers: [PermissionController],
    providers: [PermissionService],
    exports: [PermissionService]
})
export class PermissionModule {} 