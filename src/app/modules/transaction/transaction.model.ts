// src/models/transaction.model.ts

import mongoose, { Schema, Document } from 'mongoose';
import { ITransaction } from './transaction.interface';

export interface ITransactionDoc extends ITransaction, Document {}

const TransactionSchema: Schema = new Schema(
  {
    transactionId: { type: String, required: true, unique: true },
    fromAccount: {
      type: Schema.Types.ObjectId,
      ref: 'Account',
      required: false,
    },
    toAccount: { type: Schema.Types.ObjectId, ref: 'Account', required: false },
    amount: { type: Number, required: true },
    fee: { type: Number, required: true },
    transactionType: {
      type: String,
      enum: ['sendMoney', 'cashIn', 'cashOut'],
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model<ITransactionDoc>(
  'Transaction',
  TransactionSchema,
);
