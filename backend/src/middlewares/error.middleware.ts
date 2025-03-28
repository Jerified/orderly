import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ERROR } from '../config/constants';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack);

  const statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  
  res.status(statusCode).json({
    status: ERROR,
    message: err.message || 'Internal Server Error',
  });
};