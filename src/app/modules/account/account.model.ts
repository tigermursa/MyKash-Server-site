import mongoose, { Schema, Document } from 'mongoose';
import { IAccount } from './account.interface';

export interface IAccountDoc extends IAccount, Document {}

const AccountSchema: Schema = new Schema(
  {
    userID: { type: String, required: true },
    name: { type: String, required: true },
    mobile: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    nid: { type: String, required: true, unique: true },
    pin: { type: String, required: true },
    role: { type: String, enum: ['user', 'agent', 'admin'], required: true },
    balance: { type: Number },
    isBlocked: { type: Boolean, default: false },
    isActive: { type: Boolean, default: false },
    isDelete: { type: Boolean, default: false },
    favorites: { type: [String], default: [] },
  },
  { timestamps: true },
);

export default mongoose.model<IAccountDoc>('Account', AccountSchema);
