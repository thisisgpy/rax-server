import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DisbursementService } from './disbursement.service';

@ApiTags('存量融资-放款管理')
@Controller('api/v1/fin/existing/disbursement')
export class DisbursementController {
  constructor(private readonly disbursementService: DisbursementService) {}

  // TODO: 后续添加具体的API方法
} 