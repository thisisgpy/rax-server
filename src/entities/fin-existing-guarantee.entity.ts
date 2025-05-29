import { Column, Entity, PrimaryColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('fin_existing_guarantee')
export class FinExistingGuarantee {
  @ApiProperty({ description: '融资担保 ID' })
  @PrimaryColumn({ name: 'id', comment: '融资担保 ID' })
  id: string;

  @ApiProperty({ description: '存量融资 ID' })
  @Column({ name: 'existing_id', comment: '存量融资 ID' })
  existingId: string;

  @ApiProperty({ description: '担保类型. 1: 抵押, 2: 质押, 3: 保证, 4: 其他', enum: ['1', '2', '3', '4'] })
  @Column({ name: 'guarantee_type', comment: '担保类型. 1: 抵押, 2: 质押, 3: 保证, 4: 其他' })
  guaranteeType: string;

  @ApiProperty({ description: '是否为信用担保. 0: 否, 1: 是' })
  @Column({ name: 'is_credit', type: 'boolean', comment: '是否为信用担保. 0: 否, 1: 是' })
  isCredit: boolean;

  @ApiProperty({ description: '担保费率', type: 'number' })
  @Column({ name: 'fee_rate', type: 'decimal', precision: 8, scale: 4, comment: '担保费率' })
  feeRate: number;

  @ApiProperty({ description: '保证金，以分计算', type: 'number' })
  @Column({ name: 'guarantee_bonus', type: 'bigint', comment: '保证金，以分计算' })
  guaranteeBonus: number;

  @ApiProperty({ description: '反担保的担保 ID. 0 表示这行记录是担保，而不是反担保', default: '0' })
  @Column({ name: 'counter_guarantee_id', default: '0', comment: '反担保的担保 ID. 0 表示这行记录是担保，而不是反担保' })
  counterGuaranteeId: string;

  @ApiProperty({ description: '创建时间' })
  @Column({ name: 'create_time', type: 'datetime', default: () => 'CURRENT_TIMESTAMP', comment: '创建时间' })
  createTime: Date;

  @ApiProperty({ description: '创建人' })
  @Column({ name: 'create_by', comment: '创建人' })
  createBy: string;

  @ApiProperty({ description: '信息更新时间', required: false })
  @Column({ name: 'update_time', type: 'datetime', nullable: true, onUpdate: 'CURRENT_TIMESTAMP', comment: '信息更新时间' })
  updateTime: Date;

  @ApiProperty({ description: '信息更新人', required: false })
  @Column({ name: 'update_by', nullable: true, comment: '信息更新人' })
  updateBy: string;
} 