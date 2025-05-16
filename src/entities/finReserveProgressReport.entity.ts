import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('fin_reserve_progress_report')
export class FinReserveProgressReport {
  @PrimaryColumn({ name: 'id', comment: '储备融资进度报告 ID' })
  id: string;

  @Column({ name: 'reserve_id', comment: '储备融资 ID' })
  reserveId: string;

  @Column({ name: 'report_content', comment: '报告内容' })
  reportContent: string;

  @Column({ name: 'create_time', type: 'datetime', comment: '创建时间' })
  createTime: Date;

  @Column({ name: 'create_by', comment: '创建人' })
  createBy: string;

  @Column({ name: 'create_by_id', comment: '创建人 ID' })
  createById: string;
} 