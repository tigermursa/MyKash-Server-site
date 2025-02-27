import { Router } from 'express';
import * as BalanceRequestController from './balanceRequest.controller';
import { authenticate } from '../../middleware/authMiddleware';

const balanceRequestRoute = Router();

balanceRequestRoute.use(authenticate);

balanceRequestRoute.post(
  '/create',
  BalanceRequestController.createBalanceRequest,
);
balanceRequestRoute.post(
  '/approve',
  BalanceRequestController.approveBalanceRequest,
);
balanceRequestRoute.get(
  '/pending',
  BalanceRequestController.getPendingBalanceRequests,
);

export default balanceRequestRoute;
