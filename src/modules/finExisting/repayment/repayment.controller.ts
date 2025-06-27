import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RepaymentService } from './repayment.service';

@ApiTags('存量融资-还款管理')
@Controller('api/v1/fin/existing/repayment')
export class RepaymentController {
  constructor(private readonly repaymentService: RepaymentService) {}

  // TODO: 后续添加具体的API方法
} 