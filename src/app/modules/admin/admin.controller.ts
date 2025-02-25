import { Request, Response } from 'express';
import Account from '../account/account.model';
import * as AdminService from './admin.service';

export const approveAgent = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const agentId = req.params.id;
    const account = await Account.findById(agentId);
    if (!account) {
      res.status(404).json({ success: false, message: 'Agent not found' });
      return;
    }
    if (account.role !== 'agent') {
      res
        .status(400)
        .json({ success: false, message: 'Account is not an agent' });
      return;
    }

    account.isActive = true;
    account.balance = 10000;
    await account.save();
    res.status(200).json({
      success: true,
      message: 'Agent approved successfully',
      data: account,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllUsers = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { users, totalUsers, activeUsers, inactiveUsers } =
      await AdminService.getAllNonAdminUsers();
    res.status(200).json({
      success: true,
      message: 'Users fetched successfully',
      data: { totalUsers, activeUsers, inactiveUsers, users },
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userID } = req.params;
    const user = await AdminService.getUserByUserID(userID);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }
    res.status(200).json({ success: true, data: user });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getTotalBalance = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const total = await AdminService.getTotalBalance();
    res.status(200).json({ success: true, totalBalance: total });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getTotalUserBalance = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const total = await AdminService.getTotalUserBalance();
    res.status(200).json({ success: true, totalUserBalance: total });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getTotalAgentBalance = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const total = await AdminService.getTotalAgentBalance();
    res.status(200).json({ success: true, totalAgentBalance: total });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getHistory = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { userID } = req.params;
    const history = await AdminService.getTransactionHistoryByUser(userID);
    res.status(200).json({ success: true, data: history });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};
