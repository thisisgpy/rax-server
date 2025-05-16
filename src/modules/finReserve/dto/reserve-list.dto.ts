import { FinReserveStatus } from '../../../entities/finReserve.entity';
import { ApiProperty } from '@nestjs/swagger';

export class ReserveListItemDto {
  @ApiProperty({
    description: '储备融资ID',
    type: String
  })
  id: string;

  @ApiProperty({
    description: '储备融资编码',
    type: String
  })
  code: string;

  @ApiProperty({
    description: '融资主体组织ID',
    type: String
  })
  orgId: string;

  @ApiProperty({
    description: '金融机构名称',
    type: String
  })
  financialInstitution: string;

  @ApiProperty({
    description: '融资方式 (例如: 信用贷款、抵押贷款等)',
    type: String
  })
  fundingMode: string;

  @ApiProperty({
    description: '融资金额 (单位: 万元)',
    type: Number,
    minimum: 0
  })
  fundingAmount: number;

  @ApiProperty({
    description: '综合成本率 (单位: %)',
    type: Number,
    minimum: 0
  })
  combinedRatio: number;

  @ApiProperty({
    description: '预计放款日期',
    type: Date
  })
  expectedDisbursementDate: Date;

  @ApiProperty({
    description: '负责人姓名',
    type: String
  })
  leaderName: string;

  @ApiProperty({
    description: '执行人姓名',
    type: String
  })
  executorName: string;

  @ApiProperty({
    description: '储备融资状态',
    enum: FinReserveStatus,
    enumName: 'FinReserveStatus'
  })
  status: FinReserveStatus;
} 