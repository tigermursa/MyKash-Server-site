// src/controllers/balanceRequest.controller.ts
import { Request, Response } from 'express';
import * as BalanceRequestService from './balanceRequest.service';

/**
 * Endpoint for user to create a balance recharge request.
 */
export const createBalanceRequest = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { userId, amount } = req.body;
    const balanceRequest = await BalanceRequestService.createBalanceRequest(
      userId,
      amount,
    );
    res.status(200).json({
      success: true,
      message: 'Balance request created successfully',
      data: balanceRequest,
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Endpoint for admin to approve a balance request.
 */
export const approveBalanceRequest = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { requestId } = req.body;
    const { transaction, balanceRequest } =
      await BalanceRequestService.approveBalanceRequest(requestId);
    res.status(200).json({
      success: true,
      message: 'Balance request approved successfully',
      data: { transaction, balanceRequest },
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
};
