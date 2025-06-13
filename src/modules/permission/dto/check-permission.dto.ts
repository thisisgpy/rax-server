import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, IsNumber, IsString, MaxLength, Min } from "class-validator"

export class CheckPermissionDto {

  @ApiProperty({
      description: '用户ID',
      type: Number
  })
  @IsNotEmpty({ message: '用户ID不能为空' })
  @IsNumber({}, { message: '用户ID必须是数字' })
  @Min(1, { message: '用户ID必须大于0' })
  userId: number

  @ApiProperty({
    description: '资源编码',
    type: String
  })
  @IsNotEmpty({ message: '资源编码不能为空' })
  @IsString({ message: '资源编码必须是字符串' })
  @MaxLength(64, { message: '资源编码不能超过64个字符' })
  resourceCode: string

}