import { FinReserveStatus } from '../../../entities/finReserve.entity';

export class ReserveListItemDto {
  id: string;
  code: string;
  orgId: string;
  financialInstitution: string;
  fundingMode: string;
  fundingAmount: number;
  combinedRatio: number;
  expectedDisbursementDate: Date;
  leaderName: string;
  executorName: string;
  status: FinReserveStatus;
} 