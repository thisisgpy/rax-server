import { Column, Entity, PrimaryColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('fin_reserve_progress_report')
export class FinReserveProgressReport {
  @ApiProperty({
    description: '储备融资进度报告ID'
  })
  @PrimaryColumn({ name: 'id', comment: '储备融资进度报告 ID' })
  id: string;

  @ApiProperty({
    description: '储备融资ID'
  })
  @Column({ name: 'reserve_id', comment: '储备融资 ID' })
  reserveId: string;

  @ApiProperty({
    description: '报告内容'
  })
  @Column({ name: 'report_content', comment: '报告内容' })
  reportContent: string;

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
    description: '创建人ID'
  })
  @Column({ name: 'create_by_id', comment: '创建人 ID' })
  createById: string;
} 