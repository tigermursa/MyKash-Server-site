import { Router } from 'express';
import * as TransactionController from './transaction.controller';
import { authenticate } from '../../middleware/authMiddleware';

const transactionRoute = Router();

//authentication middleware
transactionRoute.use(authenticate);

transactionRoute.post('/send-money', TransactionController.sendMoney);
transactionRoute.post('/cash-in', TransactionController.cashIn);
transactionRoute.post('/cash-out', TransactionController.cashOut);

export default transactionRoute;
