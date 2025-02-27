export type BalanceRequestStatus = 'pending' | 'approved' | 'rejected';

export interface IBalanceRequest {
  requestId: string; // Unique identifier for the request
  userId: string; // ID of the user who made the request
  amount: number; // Amount to be recharged
  status: BalanceRequestStatus; // Current status of the request
  createdAt?: Date;
  updatedAt?: Date;
}
