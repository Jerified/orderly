import type { RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ERROR } from '../config/constants';
import { AnyZodObject, ZodError } from 'zod';

export const validate = (schema: AnyZodObject): RequestHandler => {
  return (req, res, next) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (err) {
      if (err instanceof ZodError) {
        res.status(StatusCodes.BAD_REQUEST).json({
          status: ERROR,
          message: 'Validation failed',
          errors: err.errors,
        });
        return;
      }
      return next(err);
    }
  };
};