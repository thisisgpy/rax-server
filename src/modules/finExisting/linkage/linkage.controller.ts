import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { LinkageService } from './linkage.service';

@ApiTags('存量融资-勾稽管理')
@Controller('api/v1/fin/existing/linkage')
export class LinkageController {
  constructor(private readonly linkageService: LinkageService) {}

  // TODO: 后续添加具体的API方法
} 