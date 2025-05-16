import { IsNotEmpty, IsString } from 'class-validator';
import { CreateReserveDto } from './create-reserve.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateReserveDto extends CreateReserveDto {
  @ApiProperty({
    description: '储备融资ID'
  })
  @IsString({ message: 'ID必须为字符串' })
  @IsNotEmpty({ message: 'ID不能为空' })
  id: string;
} 