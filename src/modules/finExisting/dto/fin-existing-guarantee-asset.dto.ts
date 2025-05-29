import { ApiProperty } from '@nestjs/swagger';

export class FinExistingGuaranteeAssetDto {

  @ApiProperty({ description: '融资担保与担保物关系 ID' })
  id: string;

  @ApiProperty({ description: '融资担保 ID' })
  guaranteeId: string;

  @ApiProperty({ description: '担保物 ID' })
  assetId: string;
} 