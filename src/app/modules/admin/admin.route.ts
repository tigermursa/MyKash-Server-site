import { Router } from 'express';
import { approveAgent } from './admin.controller';

const agentApprove = Router();

agentApprove.put('/approve-agent/:id', approveAgent);

export default agentApprove;
