// src/models/balance-request.model.ts
import mongoose, { Schema, Document } from 'mongoose';
import { IBalanceRequest } from './balance-request.interface';

export interface IBalanceRequestDoc extends IBalanceRequest, Document {}

const BalanceRequestSchema: Schema = new Schema(
  {
    requestId: { type: String, required: true, unique: true },
    userId: { type: Schema.Types.ObjectId, ref: 'Account', required: true },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
  },
  { timestamps: true },
);

export default mongoose.model<IBalanceRequestDoc>(
  'BalanceRequest',
  BalanceRequestSchema,
);
