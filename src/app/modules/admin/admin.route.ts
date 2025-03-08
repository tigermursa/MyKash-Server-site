import { Router } from 'express';
import * as AdminController from './admin.controller';
import { authenticate } from '../../middleware/authMiddleware';

const adminRoute = Router();

adminRoute.use(authenticate);

adminRoute.put('/approve-agent/:id', AdminController.approveAgent);
adminRoute.get('/users', AdminController.getAllUsers);
adminRoute.get('/user/:userID', AdminController.getUser);
adminRoute.get('/total-balance', AdminController.getTotalBalance);
adminRoute.get('/total-balance/user', AdminController.getTotalUserBalance);
adminRoute.get('/total-balance/agent', AdminController.getTotalAgentBalance);
adminRoute.get('/history/:userID', AdminController.getHistory);
adminRoute.put('/block-user/:userID', AdminController.toggleBlockUser);
export default adminRoute;
