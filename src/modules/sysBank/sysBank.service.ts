import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { SysBank } from '../../entities/sysBank.entity';
import { SearchBankDto } from './dto/search-bank.dto';
import { PageResult } from '../../common/entities/page.entity';

@Injectable()
export class SysBankService {
    constructor(
        @InjectRepository(SysBank)
        private readonly sysBankRepository: Repository<SysBank>
    ) {}

    /**
     * 多条件分页查询银行信息
     * @param searchBankDto 查询条件
     * @returns 分页结果
     */
    async search(searchBankDto: SearchBankDto): Promise<PageResult<SysBank>> {
        const { pageNo, pageSize, code, name, province, city, branchName } = searchBankDto;

        // 构建查询条件
        const where: any = {};
        if (code) {
            where.code = code;
        }
        if (name) {
            where.name = Like(`%${name}%`);
        }
        if (province) {
            where.province = province;
        }
        if (city) {
            where.city = city;
        }
        if (branchName) {
            where.branchName = Like(`%${branchName}%`);
        }

        // 执行分页查询
        const [rows, total] = await this.sysBankRepository.findAndCount({
            where,
            skip: (pageNo - 1) * pageSize,
            take: pageSize,
            order: {
                code: 'ASC'
            }
        });

        // 返回分页结果
        return PageResult.of(pageNo, pageSize, total, rows);
    }
} 