import { Column, Entity, PrimaryColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('fin_existing_guarantee_asset')
export class FinExistingGuaranteeAsset {
  @ApiProperty({ description: '融资担保与担保物关系 ID' })
  @PrimaryColumn({ name: 'id', comment: '融资担保与担保物关系 ID' })
  id: string;

  @ApiProperty({ description: '融资担保 ID' })
  @Column({ name: 'guarantee_id', comment: '融资担保 ID' })
  guaranteeId: string;

  @ApiProperty({ description: '担保物 ID' })
  @Column({ name: 'asset_id', comment: '担保物 ID' })
  assetId: string;
} 