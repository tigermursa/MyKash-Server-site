import { Router } from 'express';
import { approveAgent } from './admin.controller';
import * as AdminController from './admin.controller';

const agentApprove = Router();

agentApprove.put('/approve-agent/:id', approveAgent);

// Endpoint to get all users (excluding admins)
agentApprove.get('/users', AdminController.getAllUsers);

// Endpoint to get a single user by custom userID
agentApprove.get('/user/:userID', AdminController.getUser);

// Endpoint to get total balance (users + agents)
agentApprove.get('/total-balance', AdminController.getTotalBalance);

// Endpoint to get total balance for users only
agentApprove.get('/total-balance/user', AdminController.getTotalUserBalance);

// Endpoint to get total balance for agents only
agentApprove.get('/total-balance/agent', AdminController.getTotalAgentBalance);

// Endpoint to get transaction history for a specific user
agentApprove.get('/history/:userID', AdminController.getHistory);

export default agentApprove;
