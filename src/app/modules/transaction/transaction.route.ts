// src/routes/transaction.route.ts
import { Router } from 'express';
import * as TransactionController from './transaction.controller';

const transactionRoute = Router();

// Endpoint for sending money (user-to-user transfer)
transactionRoute.post('/send-money', TransactionController.sendMoney);

// Endpoint for cash-in (agent gives cash to user)
transactionRoute.post('/cash-in', TransactionController.cashIn);

// Endpoint for cash-out (user withdraws cash via agent)
transactionRoute.post('/cash-out', TransactionController.cashOut);

export default transactionRoute;
