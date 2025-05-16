import { Column, Entity, PrimaryColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('fin_reserve_progress')
export class FinReserveProgress {
  @ApiProperty({
    description: '储备融资进度ID'
  })
  @PrimaryColumn({ name: 'id', comment: '储备融资进度 ID' })
  id: string;

  @ApiProperty({
    description: '储备融资ID'
  })
  @Column({ name: 'reserve_id', comment: '储备融资 ID' })
  reserveId: string;

  @ApiProperty({
    description: '进度名称'
  })
  @Column({ name: 'progress_name', comment: '进度名称' })
  progressName: string;

  @ApiProperty({
    description: '计划日期'
  })
  @Column({ name: 'plan_date', type: 'date', comment: '计划日期' })
  planDate: Date;

  @ApiProperty({
    description: '实际日期'
  })
  @Column({ name: 'actual_date', type: 'date', comment: '实际日期' })
  actualDate: Date;

  @ApiProperty({
    description: '延期天数'
  })
  @Column({ name: 'delay_days', type: 'int', comment: '延期天数' })
  delayDays: number;

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