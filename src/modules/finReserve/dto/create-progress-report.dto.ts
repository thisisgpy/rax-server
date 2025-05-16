import { IsNotEmpty, IsString } from 'class-validator';

export class CreateProgressReportDto {
  @IsString()
  @IsNotEmpty({ message: '储备融资ID不能为空' })
  reserveId: string;

  @IsString()
  @IsNotEmpty({ message: '报告内容不能为空' })
  reportContent: string;
} 