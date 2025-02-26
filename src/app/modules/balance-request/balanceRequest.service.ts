// src/services/balanceRequest.service.ts
import { v4 as uuidv4 } from 'uuid';
import mongoose from 'mongoose';
import Account from '../account/account.model';
import Transaction, { ITransactionDoc } from '../transaction/transaction.model';
import BalanceRequest, { IBalanceRequestDoc } from './balance-request.model';

/**
 * User creates a balance recharge request.
 */
export const createBalanceRequest = async (
  userId: string,
  amount: number,
): Promise<IBalanceRequestDoc> => {
  const request = await BalanceRequest.create({
    requestId: uuidv4(),
    userId,
    amount,
    status: 'pending',
  });
  return request;
};

/**
 * Admin approves the balance request.
 * The function credits the user's account, marks the request as approved,
 * and creates a transaction record.
 */
export const approveBalanceRequest = async (
  requestId: string,
): Promise<{
  transaction: ITransactionDoc;
  balanceRequest: IBalanceRequestDoc;
}> => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const balanceRequest = await BalanceRequest.findOne({ requestId }).session(
      session,
    );
    if (!balanceRequest) {
      throw new Error('Balance request not found.');
    }
    if (balanceRequest.status !== 'pending') {
      throw new Error('This request has already been processed.');
    }
    const user = await Account.findById(balanceRequest.userId).session(session);
    if (!user) {
      throw new Error('User not found.');
    }

    // Update user's balance with the requested amount.
    user.balance += balanceRequest.amount;
    await user.save({ session });

    // Mark the request as approved.
    balanceRequest.status = 'approved';
    await balanceRequest.save({ session });

    // Optionally create a transaction record for the balance request.
    const createdTransactions = await Transaction.create(
      [
        {
          transactionId: uuidv4(),
          toAccount: user._id,
          amount: balanceRequest.amount,
          fee: 0, // No fee for balance requests
          transactionType: 'balanceRequest',
        },
      ],
      { session },
    );

    await session.commitTransaction();
    session.endSession();
    return { transaction: createdTransactions[0], balanceRequest };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};
