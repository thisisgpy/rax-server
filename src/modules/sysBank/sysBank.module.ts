import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SysBank } from '../../entities/sysBank.entity';
import { SysBankController } from './sysBank.controller';
import { SysBankService } from './sysBank.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([SysBank])
    ],
    controllers: [SysBankController],
    providers: [SysBankService],
    exports: [SysBankService]
})
export class SysBankModule {} 