import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProgressReportDto {
  @ApiProperty({
    description: '储备融资ID'
  })
  @IsString()
  @IsNotEmpty({ message: '储备融资ID不能为空' })
  reserveId: string;

  @ApiProperty({
    description: '报告内容'
  })
  @IsString()
  @IsNotEmpty({ message: '报告内容不能为空' })
  reportContent: string;
} 