import Account from '../account/account.model';
import Transaction from '../transaction/transaction.model';
import { ITransactionDoc } from '../transaction/transaction.model';

/**
 * Get all accounts that are not admin.
 */
export const getAllNonAdminUsers = async () => {
  // Run queries in parallel
  const [users, totalUsers, activeUsers] = await Promise.all([
    Account.find({ role: { $ne: 'admin' } }),
    Account.countDocuments({ role: { $ne: 'admin' } }),
    Account.countDocuments({ role: { $ne: 'admin' }, isActive: true }),
  ]);

  const inactiveUsers = totalUsers - activeUsers;

  return { users, totalUsers, activeUsers, inactiveUsers };
};

/**
 * Get a single account by its custom userID.
 */
export const getUserByUserID = async (userID: string) => {
  const user = await Account.findOne({ userID });
  return user;
};

/**
 * Get the total balance of accounts with role user or agent.
 */
export const getTotalBalance = async (): Promise<number> => {
  const result = await Account.aggregate([
    { $match: { role: { $in: ['user', 'agent'] } } },
    { $group: { _id: null, total: { $sum: '$balance' } } },
  ]);
  return result.length ? result[0].total : 0;
};

/**
 * Get the total balance of accounts with role user.
 */
export const getTotalUserBalance = async (): Promise<number> => {
  const result = await Account.aggregate([
    { $match: { role: 'user' } },
    { $group: { _id: null, total: { $sum: '$balance' } } },
  ]);
  return result.length ? result[0].total : 0;
};

/**
 * Get the total balance of accounts with role agent.
 */
export const getTotalAgentBalance = async (): Promise<number> => {
  const result = await Account.aggregate([
    { $match: { role: 'agent' } },
    { $group: { _id: null, total: { $sum: '$balance' } } },
  ]);
  return result.length ? result[0].total : 0;
};

/**
 * Get the transaction history for a given user.
 * It looks up the account by the custom userID and then finds any transactions
 * where the account appears as either the sender or receiver.
 * The results are populated with the sender’s and receiver’s userID and name.
 */
export const getTransactionHistoryByUser = async (
  userID: string,
): Promise<ITransactionDoc[]> => {
  // First, find the account by its custom userID
  const user = await Account.findOne({ userID });
  if (!user) {
    throw new Error('User not found.');
  }
  const transactions = await Transaction.find({
    $or: [{ fromAccount: user._id }, { toAccount: user._id }],
  })
    .populate('fromAccount', 'userID name')
    .populate('toAccount', 'userID name')
    .sort({ createdAt: -1 });
  return transactions;
};
