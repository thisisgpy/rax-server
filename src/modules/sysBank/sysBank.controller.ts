import { Controller, Post, Body } from '@nestjs/common';
import { SysBankService } from './sysBank.service';
import { SearchBankDto } from './dto/search-bank.dto';
import { PageResult } from '../../common/entities/page.entity';
import { SysBank } from '../../entities/sysBank.entity';

@Controller('api/v1/bank')
export class SysBankController {
    constructor(private readonly sysBankService: SysBankService) {}

    /**
     * 多条件分页查询银行信息
     * @param searchBankDto 查询条件
     * @returns 分页结果
     */
    @Post('search')
    async search(@Body() searchBankDto: SearchBankDto): Promise<PageResult<SysBank>> {
        return this.sysBankService.search(searchBankDto);
    }
} 