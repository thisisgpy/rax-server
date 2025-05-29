import { Column, Entity, PrimaryColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('fin_existing_disbursement_repayment_rel')
export class FinExistingDisbursementRepaymentRel {
  @ApiProperty({ description: '关系 ID' })
  @PrimaryColumn({ name: 'id', comment: '关系 ID' })
  id: string;

  @ApiProperty({ description: '存量融资 ID' })
  @Column({ name: 'existing_id', comment: '存量融资 ID' })
  existingId: string;

  @ApiProperty({ description: '融资放款 ID' })
  @Column({ name: 'disbursement_id', comment: '融资放款 ID' })
  disbursementId: string;

  @ApiProperty({ description: '还本付息计划 ID' })
  @Column({ name: 'repayment_id', comment: '还本付息计划 ID' })
  repaymentId: string;
} 