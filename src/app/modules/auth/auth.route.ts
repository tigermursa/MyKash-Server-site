import { Router } from 'express';
import * as AuthController from '../auth/auth.controller';
import { validateLogin, validateRegister } from '../auth/auth.validation';

const router = Router();

// Register account (User or Agent)
router.post('/register', validateRegister, AuthController.register);

// Log in with mobile/email and PIN
router.post('/login', validateLogin, AuthController.login);

// Log out by clearing the cookie
router.get('/logout', AuthController.logout);

export default router;
