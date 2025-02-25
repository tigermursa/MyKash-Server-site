import { Request, Response } from 'express';
import Account from '../account/account.model';

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
