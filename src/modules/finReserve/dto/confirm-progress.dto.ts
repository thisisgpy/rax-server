import { IsNotEmpty, IsString, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class ConfirmProgressDto {
  @IsString()
  @IsNotEmpty({ message: '进度ID不能为空' })
  id: string;

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty({ message: '实际完成日期不能为空' })
  actualDate: Date;
} 