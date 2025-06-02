import { IsString, IsBoolean, IsOptional, IsNotEmpty, MaxLength, IsNumber, Min} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateDictDto {
    @ApiProperty({
        description: '字典ID',
        type: Number
    })
    @IsNumber({}, { message: '字典ID必须是数字' })
    @IsNotEmpty({ message: '字典ID不能为空' })
    @Min(0, { message: '字典ID不能小于0' })
    id: number;

    @ApiProperty({
        description: '字典名称',
        type: String,
        maxLength: 64
    })
    @IsString({ message: '字典名称必须是字符串' })
    @IsNotEmpty({ message: '字典名称不能为空' })
    @MaxLength(64, { message: '字典名称不能超过64个字符' })
    name: string;

    @ApiProperty({
        description: '字典备注',
        type: String,
        maxLength: 128,
        required: false
    })
    @IsString({ message: '字典备注必须是字符串' })
    @IsOptional()
    @MaxLength(128, { message: '字典备注不能超过128个字符' })
    comment?: string;

    @ApiProperty({
        description: '是否启用',
        type: Boolean
    })
    @IsBoolean({ message: '是否启用必须是布尔值' })
    @IsNotEmpty({ message: '是否启用不能为空' })
    isEnabled: boolean = true;
} 