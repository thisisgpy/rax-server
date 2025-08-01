import { IsNotEmpty, IsString, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLinkageDto {
    @ApiProperty({
        description: '储备融资ID',
        type: Number
    })
    @IsNotEmpty({ message: '储备融资ID不能为空' })
    @IsNumber({}, { message: '储备融资ID必须是数字' })
    @Min(1, { message: '储备融资ID必须大于0' })
    reserveId: number;

    @ApiProperty({
        description: '勾稽金额 (单位: 万元)',
        type: String,
        example: '50.00'
    })
    @IsNotEmpty({ message: '勾稽金额不能为空' })
    @IsString({ message: '勾稽金额必须是字符串' })
    linkageAmount: string;
} 