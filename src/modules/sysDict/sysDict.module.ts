import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SysDict } from '../../entities/sysDict.entity';
import { SysDictItem } from '../../entities/sysDictItem.entity';
import { SysDictService } from './sysDict.service';
import { SysDictController } from './sysDict.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([SysDict, SysDictItem])
    ],
    controllers: [SysDictController],
    providers: [SysDictService],
    exports: [SysDictService]
})
export class SysDictModule {} 