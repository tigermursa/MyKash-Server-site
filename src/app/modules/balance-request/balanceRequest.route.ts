// src/routes/balanceRequest.route.ts
import { Router } from 'express';
import * as BalanceRequestController from './balanceRequest.controller';

const balanceRequestRoute = Router();

// Endpoint to create a balance recharge request (user)
balanceRequestRoute.post(
  '/create',
  BalanceRequestController.createBalanceRequest,
);

// Endpoint to approve a balance recharge request (admin)
balanceRequestRoute.post(
  '/approve',
  BalanceRequestController.approveBalanceRequest,
);

export default balanceRequestRoute;
