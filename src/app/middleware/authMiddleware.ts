// src/middleware/authMiddleware.ts
import { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthenticatedRequest extends Request {
  user?: any;
}

export const authenticate: RequestHandler = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    res
      .status(401)
      .json({
        success: false,
        message: 'Authentication required: no token provided',
      });
    return; // Ensure nothing is returned after sending response.
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    // Type assertion to add the user property
    (req as AuthenticatedRequest).user = decoded;
    next();
  } catch (error) {
    res
      .status(401)
      .json({ success: false, message: 'Invalid or expired token' });
    return;
  }
};
