import { ApiProperty } from '@nestjs/swagger';

export class FinExistingGuaranteeDto {

  @ApiProperty({ description: '融资担保 ID' })
  id: string;

  @ApiProperty({ description: '存量融资 ID' })
  existingId: string;

  @ApiProperty({ description: '担保类型. 1: 抵押, 2: 质押, 3: 保证, 4: 其他', enum: ['1', '2', '3', '4'] })
  guaranteeType: string;

  @ApiProperty({ description: '是否为信用担保. 0: 否, 1: 是' })
  isCredit: boolean;

  @ApiProperty({ description: '担保费率', type: Number })
  feeRate: number;

  @ApiProperty({ description: '保证金（分）', type: String })
  guaranteeBonus: string;

  @ApiProperty({ description: '反担保的担保 ID. 0 表示这行记录是担保，而不是反担保', default: '0' })
  counterGuaranteeId: string;

  @ApiProperty({ description: '反担保记录列表', type: [FinExistingGuaranteeDto], required: false })
  counterGuarantees?: FinExistingGuaranteeDto[];

  @ApiProperty({ description: '担保物 ID 列表', type: [String], required: false })
  assetIds?: string[];

  @ApiProperty({ description: '创建时间' })
  createTime: Date;

  @ApiProperty({ description: '创建人' })
  createBy: string;

  @ApiProperty({ description: '信息更新时间', required: false })
  updateTime: Date;

  @ApiProperty({ description: '信息更新人', required: false })
  updateBy: string;
} 