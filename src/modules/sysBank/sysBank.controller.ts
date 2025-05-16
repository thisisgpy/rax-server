import { Controller, Post, Body } from '@nestjs/common';
import { SysBankService } from './sysBank.service';
import { SearchBankDto } from './dto/search-bank.dto';
import { PageResult } from '../../common/entities/page.entity';
import { SysBank } from '../../entities/sysBank.entity';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('银行管理')
@Controller('api/v1/bank')
export class SysBankController {
    constructor(private readonly sysBankService: SysBankService) {}

    /**
     * 多条件分页查询银行信息
     * @param searchBankDto 查询条件
     * @returns 分页结果
     */
    @ApiOperation({
        summary: '分页查询银行信息',
        description: '根据多个条件分页查询银行信息列表'
    })
    @ApiResponse({
        status: 200,
        description: '查询成功',
        type: PageResult<SysBank>
    })
    @Post('search')
    async search(@Body() searchBankDto: SearchBankDto): Promise<PageResult<SysBank>> {
        return this.sysBankService.search(searchBankDto);
    }
} 