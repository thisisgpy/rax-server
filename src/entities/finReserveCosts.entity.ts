import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('fin_reserve_costs')
export class FinReserveCosts {
  @PrimaryColumn({ name: 'id', comment: '储备融资成本 ID' })
  id: string;

  @Column({ name: 'reserve_id', comment: '储备融资 ID' })
  reserveId: string;

  @Column({ name: 'cost_type', comment: '成本类型' })
  costType: string;

  @Column({ name: 'cost_amount', comment: '成本数据.可能是数字、百分比、文字' })
  costAmount: string;

  @Column({ name: 'create_time', type: 'datetime', comment: '创建时间' })
  createTime: Date;

  @Column({ name: 'create_by', comment: '创建人' })
  createBy: string;

  @Column({ name: 'update_time', type: 'datetime', comment: '信息更新时间' })
  updateTime: Date;

  @Column({ name: 'update_by', comment: '信息更新人' })
  updateBy: string;
} 