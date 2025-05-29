import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, Matches, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

// 反担保记录DTO（用于创建时的嵌套对象）
export class CreateCounterGuaranteeDto {
  @ApiProperty({ description: '担保类型', required: true})
  @IsString({ message: '担保类型必须是字符串类型' })
  @IsNotEmpty({ message: '担保类型不能为空' })
  guaranteeType: string;

  @ApiProperty({ description: '是否为信用担保', default: false })
  @IsBoolean({ message: '是否为信用担保必须是布尔类型' })
  @IsNotEmpty({ message: '是否为信用担保不能为空' })
  isCredit: boolean;

  @ApiProperty({ description: '担保费率', example: 1234.5678 })
  @IsNumber({ maxDecimalPlaces: 4 }, { message: '担保费率必须是数字类型，最多支持 4 位小数' })
  @IsNotEmpty({ message: '担保费率不能为空' })
  feeRate: number;

  @ApiProperty({ 
    description: '保证金，以万元为单位，支持 6 位小数',
    example: '100.123456'
  })
  @IsString({ message: '保证金必须是字符串类型' })
  @IsNotEmpty({ message: '保证金不能为空' })
  @Matches(/^\d+(\.\d{1,6})?$/, { message: '保证金格式不正确，应为正数且最多支持 6 位小数' })
  guaranteeBonus: string;

  @ApiProperty({ description: '担保物 ID 数组', type: [String], required: false })
  @IsOptional()
  @IsArray({ message: '担保物ID必须是数组类型' })
  @IsString({ each: true, message: '担保物ID必须是字符串类型' })
  assetIds?: string[];
}

export class CreateFinExistingGuaranteeDto {

  @ApiProperty({ description: '存量融资 ID' })
  @IsString({ message: '存量融资ID必须是字符串类型' })
  @IsNotEmpty({ message: '存量融资ID不能为空' })
  existingId: string;

  @ApiProperty({ description: '担保类型', required: true})
  @IsString({ message: '担保类型必须是字符串类型' })
  @IsNotEmpty({ message: '担保类型不能为空' })
  guaranteeType: string;

  @ApiProperty({ description: '是否为信用担保', default: false })
  @IsBoolean({ message: '是否为信用担保必须是布尔类型' })
  @IsNotEmpty({ message: '是否为信用担保不能为空' })
  isCredit: boolean;

  @ApiProperty({ description: '担保费率', example: 1234.5678 })
  @IsNumber({ maxDecimalPlaces: 4 }, { message: '担保费率必须是数字类型，最多支持 4 位小数' })
  @IsNotEmpty({ message: '担保费率不能为空' })
  feeRate: number;

  @ApiProperty({ 
    description: '保证金',
    example: '100.123456'
  })
  @IsString({ message: '保证金必须是字符串类型' })
  @IsNotEmpty({ message: '保证金不能为空' })
  @Matches(/^\d+(\.\d{1,6})?$/, { message: '保证金格式不正确，应为正数且最多支持 6 位小数' })
  guaranteeBonus: string;

  @ApiProperty({ description: '担保物 ID 数组', type: [String], required: false })
  @IsOptional()
  @IsArray({ message: '担保物ID必须是数组类型' })
  @IsString({ each: true, message: '担保物ID必须是字符串类型' })
  assetIds?: string[];

  @ApiProperty({ 
    description: '反担保记录详情数组', 
    type: [CreateCounterGuaranteeDto], 
    required: false 
  })
  @IsOptional()
  @IsArray({ message: '反担保记录必须是数组类型' })
  @ValidateNested({ each: true })
  @Type(() => CreateCounterGuaranteeDto)
  counterGuarantees?: CreateCounterGuaranteeDto[];
} 