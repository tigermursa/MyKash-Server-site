import { Request, Response } from 'express';
import * as AuthService from '../auth/auth.service';

export const register = async (req: Request, res: Response) => {
  try {
    const account = await AuthService.register(req.body);
    res.status(201).json({
      success: true,
      message: 'Account registered successfully',
      data: account,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { identifier, pin } = req.body;
    const { account, token } = await AuthService.login(identifier, pin);

    // Set the token in an HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      data: account,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie('token');
  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
};
