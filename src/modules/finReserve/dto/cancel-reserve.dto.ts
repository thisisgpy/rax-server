import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CancelReserveDto {
  @ApiProperty({
    description: '要取消的储备融资记录ID',
    type: String
  })
  @IsString()
  @IsNotEmpty({ message: '储备融资ID不能为空' })
  id: string;

  @ApiProperty({
    description: '取消储备融资的具体原因说明',
    type: String
  })
  @IsString()
  @IsNotEmpty({ message: '取消原因不能为空' })
  cancelReason: string;
} 