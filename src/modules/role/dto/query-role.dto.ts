import { IsOptional, IsString, MaxLength } from "class-validator";
import { PageQueryDto } from "src/common/entities/page.entity";
import { ApiProperty } from '@nestjs/swagger';

export class QueryRoleDto extends PageQueryDto {

  @ApiProperty({
    description: '角色名称',
    type: String,
    maxLength: 64
  })
  @IsOptional()
  @IsString({ message: '角色名称必须是字符串' })
  @MaxLength(64, { message: '角色名称不能超过64个字符' })
  name?: string;

}