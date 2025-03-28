import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ERROR } from '../config/constants';
import { AuthenticatedRequest } from './auth.middleware';
import { UserRole } from '../interfaces/user.interface';

export const isAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.user.role !== UserRole.ADMIN) {
    return res.status(StatusCodes.FORBIDDEN).json({
      status: ERROR,
      message: 'Not authorized to access this route',
    });
  }
  next();
};