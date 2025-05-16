import { Column, Entity, PrimaryColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('fin_reserve_costs')
export class FinReserveCosts {
  @ApiProperty({
    description: '储备融资成本ID'
  })
  @PrimaryColumn({ name: 'id', comment: '储备融资成本 ID' })
  id: string;

  @ApiProperty({
    description: '储备融资ID'
  })
  @Column({ name: 'reserve_id', comment: '储备融资 ID' })
  reserveId: string;

  @ApiProperty({
    description: '成本类型'
  })
  @Column({ name: 'cost_type', comment: '成本类型' })
  costType: string;

  @ApiProperty({
    description: '成本数据(可能是数字、百分比、文字)'
  })
  @Column({ name: 'cost_amount', comment: '成本数据.可能是数字、百分比、文字' })
  costAmount: string;

  @ApiProperty({
    description: '创建时间'
  })
  @Column({ name: 'create_time', type: 'datetime', comment: '创建时间' })
  createTime: Date;

  @ApiProperty({
    description: '创建人'
  })
  @Column({ name: 'create_by', comment: '创建人' })
  createBy: string;

  @ApiProperty({
    description: '更新时间'
  })
  @Column({ name: 'update_time', type: 'datetime', comment: '信息更新时间' })
  updateTime: Date;

  @ApiProperty({
    description: '更新人'
  })
  @Column({ name: 'update_by', comment: '信息更新人' })
  updateBy: string;
} 