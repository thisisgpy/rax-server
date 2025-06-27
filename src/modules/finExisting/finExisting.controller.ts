import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FinExistingService } from './finExisting.service';

@ApiTags('存量融资管理')
@Controller('api/v1/fin/existing')
export class FinExistingController {
  constructor(private readonly finExistingService: FinExistingService) {}

  // TODO: 后续添加具体的API方法
} 