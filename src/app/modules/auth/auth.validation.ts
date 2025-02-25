import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';

const registerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  mobile: z.string().min(10, 'Mobile must be at least 10 characters'),
  email: z.string().email('Invalid email'),
  nid: z.string().min(5, 'NID is required'),
  pin: z.string().length(5, 'PIN must be exactly 5 characters'),
  role: z.enum(['user', 'agent']), // Admin accounts are created manually
});

const loginSchema = z.object({
  identifier: z.string().min(1, 'Identifier is required'), // mobile or email
  pin: z.string().length(5, 'PIN must be exactly 5 characters'),
});

export const validateRegister = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  try {
    registerSchema.parse(req.body);
    next();
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.errors ? error.errors : error.message,
    });
  }
};

export const validateLogin = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  try {
    loginSchema.parse(req.body);
    next();
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.errors ? error.errors : error.message,
    });
  }
};
