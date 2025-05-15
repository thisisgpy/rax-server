import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SysOrg } from '../../entities/sysOrg.entity';
import { SysOrgController } from './sysOrg.controller';
import { SysOrgService } from './sysOrg.service';
import { ContextModule } from '../../common/context/context.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([SysOrg]),
        ContextModule,
    ],
    controllers: [SysOrgController],
    providers: [SysOrgService],
    exports: [SysOrgService]
})
export class SysOrgModule {} 