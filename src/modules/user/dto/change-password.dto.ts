import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({
    description: '用户ID',
    type: Number,
  })
  @IsNotEmpty({ message: '用户ID不能为空' })
  @IsNumber({}, { message: '用户ID必须是数字' })
  @Min(1, { message: '用户ID必须大于0' })
  id: number;

  @ApiProperty({
    description: '旧密码',
    type: String,
    minLength: 6,
    maxLength: 20,
  })
  @IsNotEmpty({ message: '旧密码不能为空' })
  @IsString({ message: '旧密码必须是字符串' })
  @MinLength(6, { message: '旧密码至少6个字符' })
  @MaxLength(32, { message: '旧密码不能超过32个字符' })
  oldPassword: string;

  @ApiProperty({
    description: '新密码',
    type: String,
    minLength: 6,
    maxLength: 32,
  })
  @IsNotEmpty({ message: '新密码不能为空' })
  @IsString({ message: '新密码必须是字符串' })
  @MinLength(6, { message: '新密码至少6个字符' })
  @MaxLength(32, { message: '新密码不能超过32个字符' })
  newPassword: string;
}
