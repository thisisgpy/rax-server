import { IsNotEmpty, IsString } from 'class-validator';
import { CreateReserveDto } from './create-reserve.dto';

export class UpdateReserveDto extends CreateReserveDto {
  @IsString({ message: 'ID必须为字符串' })
  @IsNotEmpty({ message: 'ID不能为空' })
  id: string;
} 