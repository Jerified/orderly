import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import { ERROR, JWT_SECRET } from '../config/constants';
import { UserRole } from '../interfaces/user.interface';

export interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    role: UserRole;
  };
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      status: ERROR,
      message: 'Missing or malformed authorization header',
    });
  }

  const token = authHeader.split(' ')[1];
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; role: UserRole };
    (req as AuthenticatedRequest).user = decoded;
    return next();
  } catch (error) {
    console.error('JWT verification failed:', error);
    return res.status(StatusCodes.UNAUTHORIZED).json({
      status: ERROR,
      message: 'Invalid or expired token',
    });
  }
};