// src/controllers/transaction.controller.ts
import { Request, Response } from 'express';
import * as TransactionService from './transaction.service';

export const sendMoney = async (req: Request, res: Response): Promise<void> => {
  try {
    const { senderId, receiverId, amount, isFavoriteTransfer } = req.body;
    const transaction = await TransactionService.processSendMoney({
      senderId,
      receiverId,
      amount,
      isFavoriteTransfer,
    });
    res.status(200).json({
      success: true,
      message: 'Money sent successfully',
      data: transaction,
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const cashIn = async (req: Request, res: Response): Promise<void> => {
  try {
    const { agentId, userId, amount, agentPin } = req.body;
    const transaction = await TransactionService.processCashIn({
      agentId,
      userId,
      amount,
      agentPin,
    });
    res.status(200).json({
      success: true,
      message: 'Cash-in successful',
      data: transaction,
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const cashOut = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, agentId, amount, userPin } = req.body;
    const transaction = await TransactionService.processCashOut({
      userId,
      agentId,
      amount,
      userPin,
    });
    res.status(200).json({
      success: true,
      message: 'Cash-out successful',
      data: transaction,
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};
