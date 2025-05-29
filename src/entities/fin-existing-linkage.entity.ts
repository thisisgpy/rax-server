import { Column, Entity, PrimaryColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('fin_existing_linkage')
export class FinExistingLinkage {
  @ApiProperty({ description: '融资勾稽 ID' })
  @PrimaryColumn({ name: 'id', comment: '融资勾稽 ID' })
  id: string;

  @ApiProperty({ description: '存量融资 ID' })
  @Column({ name: 'existing_id', comment: '存量融资 ID' })
  existingId: string;

  @ApiProperty({ description: '储备融资 ID' })
  @Column({ name: 'reserve_id', comment: '储备融资 ID' })
  reserveId: string;

  @ApiProperty({ description: '勾稽金额，以分计算', type: 'number' })
  @Column({ name: 'linkage_amount', type: 'bigint', comment: '勾稽金额，以分计算' })
  linkageAmount: number;

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