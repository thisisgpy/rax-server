import { IsNotEmpty, IsString, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateDisbursementDto {
    @ApiProperty({
        description: '放款金额 (单位: 万元)',
        type: String,
        example: '100.50'
    })
    @IsNotEmpty({ message: '放款金额不能为空' })
    @IsString({ message: '放款金额必须是字符串' })
    amount: string;

    @ApiProperty({
        description: '到账日期',
        type: Date,
        example: '2024-01-15'
    })
    @IsOptional()
    @IsDateString({}, { message: '到账日期格式不正确' })
    @Type(() => Date)
    accountingDate?: Date;

    @ApiProperty({
        description: '放款方式',
        type: String,
        maxLength: 64,
        required: false
    })
    @IsOptional()
    @IsString({ message: '放款方式必须是字符串' })
    disbursementMethod?: string;

    @ApiProperty({
        description: '起息日',
        type: Date,
        example: '2024-01-15'
    })
    @IsOptional()
    @IsDateString({}, { message: '起息日格式不正确' })
    @Type(() => Date)
    interestStartDate?: Date;

    @ApiProperty({
        description: '首次还款日',
        type: Date,
        example: '2024-02-15'
    })
    @IsOptional()
    @IsDateString({}, { message: '首次还款日格式不正确' })
    @Type(() => Date)
    firstRepaymentDate?: Date;

    @ApiProperty({
        description: '最后还款日',
        type: Date,
        example: '2026-01-15'
    })
    @IsOptional()
    @IsDateString({}, { message: '最后还款日格式不正确' })
    @Type(() => Date)
    lastRepaymentDate?: Date;
} 