import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('fin_reserve_progress')
export class FinReserveProgress {
  @PrimaryColumn({ name: 'id', comment: '储备融资进度 ID' })
  id: string;

  @Column({ name: 'reserve_id', comment: '储备融资 ID' })
  reserveId: string;

  @Column({ name: 'progress_name', comment: '进度名称' })
  progressName: string;

  @Column({ name: 'plan_date', type: 'date', comment: '计划日期' })
  planDate: Date;

  @Column({ name: 'actual_date', type: 'date', comment: '实际日期' })
  actualDate: Date;

  @Column({ name: 'delay_days', type: 'int', comment: '延期天数' })
  delayDays: number;

  @Column({ name: 'update_time', type: 'datetime', comment: '信息更新时间' })
  updateTime: Date;

  @Column({ name: 'update_by', comment: '信息更新人' })
  updateBy: string;
} 