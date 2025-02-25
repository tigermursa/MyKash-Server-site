// src/interfaces/transaction.interface.ts
export type TransactionType = 'sendMoney' | 'cashIn' | 'cashOut';

export interface ITransaction {
  transactionId: string; // Unique identifier
  fromAccount?: string; // Sender account _id (or null for cash-in)
  toAccount?: string; // Recipient account _id (or agent/admin for fee allocations)
  amount: number; // Main transaction amount
  fee: number; // Fee applied (if any)
  transactionType: TransactionType;
  createdAt?: Date;
  updatedAt?: Date;
}
