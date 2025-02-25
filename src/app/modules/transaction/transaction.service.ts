import { v4 as uuidv4 } from 'uuid';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Account from '../account/account.model';
import Transaction, { ITransactionDoc } from './transaction.model';

interface ProcessSendMoneyParams {
  senderId: string;
  receiverId: string;
  amount: number;
  isFavoriteTransfer?: boolean; // if the receiver is already in sender's favorites, fee is waived
}

export const processSendMoney = async ({
  senderId,
  receiverId,
  amount,
  isFavoriteTransfer = false,
}: ProcessSendMoneyParams): Promise<ITransactionDoc> => {
  if (amount < 50) {
    throw new Error('Minimum send amount is 50 taka.');
  }

  // Start a Mongoose session for atomic operations
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // Retrieve sender, receiver and admin accounts within the session
    const sender = await Account.findById(senderId).session(session);
    const receiver = await Account.findById(receiverId).session(session);
    const admin = await Account.findOne({ role: 'admin' }).session(session);

    if (!sender || !receiver || !admin) {
      throw new Error('Sender, receiver or admin account not found.');
    }

    // Auto-check if receiver is in sender's favorites if not explicitly set
    let isFavorite = isFavoriteTransfer;
    if (
      !isFavorite &&
      sender.favorites &&
      sender.favorites.length > 0 &&
      receiver.mobile
    ) {
      isFavorite = sender.favorites.includes(receiver.mobile);
    }

    // Fee: if amount > 100 and not a favorite transfer, charge 5 taka; otherwise fee is 0.
    const fee = amount > 100 && !isFavorite ? 5 : 0;
    const totalDeduction = amount + fee;

    if (sender.balance < totalDeduction) {
      throw new Error('Insufficient balance.');
    }

    // Update account balances
    sender.balance -= totalDeduction;
    receiver.balance += amount;
    if (fee > 0) {
      admin.balance += fee; // Admin collects the fee
    }

    await sender.save({ session });
    await receiver.save({ session });
    await admin.save({ session });

    // Create a transaction record
    const createdTransactions = await Transaction.create(
      [
        {
          transactionId: uuidv4(),
          fromAccount: sender._id,
          toAccount: receiver._id,
          amount,
          fee,
          transactionType: 'sendMoney',
        },
      ],
      { session },
    );

    await session.commitTransaction();
    session.endSession();
    return createdTransactions[0];
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

interface ProcessCashInParams {
  agentId: string;
  userId: string;
  amount: number;
  agentPin: string;
}

export const processCashIn = async ({
  agentId,
  userId,
  amount,
  agentPin,
}: ProcessCashInParams): Promise<ITransactionDoc> => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const agent = await Account.findById(agentId).session(session);
    const user = await Account.findById(userId).session(session);

    if (!agent || !user) {
      throw new Error('Agent or User not found.');
    }

    // Validate the agent's PIN using bcrypt
    const isMatch = await bcrypt.compare(agentPin, agent.pin);
    if (!isMatch) {
      throw new Error('Invalid agent PIN.');
    }

    if (agent.balance < amount) {
      throw new Error('Agent has insufficient balance for cash-in.');
    }

    // Deduct from agent, credit the user
    agent.balance -= amount;
    user.balance += amount;

    await agent.save({ session });
    await user.save({ session });

    const createdTransactions = await Transaction.create(
      [
        {
          transactionId: uuidv4(),
          fromAccount: agent._id,
          toAccount: user._id,
          amount,
          fee: 0,
          transactionType: 'cashIn',
        },
      ],
      { session },
    );

    await session.commitTransaction();
    session.endSession();
    return createdTransactions[0];
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

interface ProcessCashOutParams {
  userId: string;
  agentId: string;
  amount: number;
  userPin: string;
}

export const processCashOut = async ({
  userId,
  agentId,
  amount,
  userPin,
}: ProcessCashOutParams): Promise<ITransactionDoc> => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const user = await Account.findById(userId).session(session);
    const agent = await Account.findById(agentId).session(session);
    const admin = await Account.findOne({ role: 'admin' }).session(session);

    if (!user || !agent || !admin) {
      throw new Error('User, agent or admin account not found.');
    }

    // Validate user's PIN using bcrypt
    const isMatch = await bcrypt.compare(userPin, user.pin);
    if (!isMatch) {
      throw new Error('Invalid user PIN.');
    }

    // Calculate fee: 1.5% of the amount
    const fee = parseFloat((amount * 0.015).toFixed(2));
    // Total deduction from user's account
    const totalDeduction = parseFloat((amount + fee).toFixed(2));
    if (user.balance < totalDeduction) {
      throw new Error('Insufficient balance for cash-out.');
    }

    // Agent receives the full requested amount plus a 1% commission.
    const agentCredit = parseFloat((amount * 1.01).toFixed(2));
    // Admin earns 0.5% commission.
    const adminIncome = parseFloat((amount * 0.005).toFixed(2));

    // Update balances accordingly
    user.balance -= totalDeduction;
    agent.balance += agentCredit;
    admin.balance += adminIncome;

    await user.save({ session });
    await agent.save({ session });
    await admin.save({ session });

    // Create a transaction record
    const createdTransactions = await Transaction.create(
      [
        {
          transactionId: uuidv4(),
          fromAccount: user._id,
          toAccount: agent._id,
          amount,
          fee,
          transactionType: 'cashOut',
        },
      ],
      { session },
    );

    await session.commitTransaction();
    session.endSession();
    return createdTransactions[0];
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};
