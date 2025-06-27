import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GuaranteeService } from './guarantee.service';

@ApiTags('存量融资-担保管理')
@Controller('api/v1/fin/existing/guarantee')
export class GuaranteeController {
  constructor(private readonly guaranteeService: GuaranteeService) {}

  // TODO: 后续添加具体的API方法
} 