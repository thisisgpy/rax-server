import { IsNotEmpty, IsString, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ConfirmProgressDto {
  @ApiProperty({
    description: '进度ID'
  })
  @IsString()
  @IsNotEmpty({ message: '进度ID不能为空' })
  id: string;

  @ApiProperty({
    description: '实际完成日期'
  })
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty({ message: '实际完成日期不能为空' })
  actualDate: Date;
} 