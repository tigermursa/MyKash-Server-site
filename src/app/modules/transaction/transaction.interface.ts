export type TransactionType =
  | 'sendMoney'
  | 'cashIn'
  | 'cashOut'
  | 'balanceRequest';

export interface ITransaction {
  transactionId: string; // Unique identifier
  fromAccount?: string; // Sender account _id (or null if not applicable)
  toAccount?: string; // Recipient account _id (or agent/admin for fee allocations)
  amount: number; // Main transaction amount
  fee: number; // Fee applied (if any)
  transactionType: TransactionType;
  createdAt?: Date;
  updatedAt?: Date;
}
