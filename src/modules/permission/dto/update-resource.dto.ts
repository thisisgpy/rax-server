import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { CreateResourceDto } from './create-resource.dto';

export class UpdateResourceDto extends CreateResourceDto {
    @ApiProperty({ description: '资源ID' })
    @IsNotEmpty({ message: '资源ID不能为空' })
    @IsNumber({}, { message: '资源ID必须是数字' })
    id: number;
} 