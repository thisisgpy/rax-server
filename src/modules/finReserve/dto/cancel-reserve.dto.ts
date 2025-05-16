import { IsNotEmpty, IsString } from 'class-validator';

export class CancelReserveDto {
  @IsString()
  @IsNotEmpty({ message: '储备融资ID不能为空' })
  id: string;

  @IsString()
  @IsNotEmpty({ message: '取消原因不能为空' })
  cancelReason: string;
} 