export const MONGO_URI = process.env.MONGO_URI || '';
export const PORT = process.env.PORT || 8000;
export const JWT_SECRET = process.env.JWT_SECRET || 'secret';
export const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';

export const SUCCESS = 'success';
export const FAIL = 'fail';
export const ERROR = 'error';
export const NOT_FOUND = 'not_found';

export const ORDER_STATUS = {
  REVIEW: 'review',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
} as const;

export type ORDER_STATUS = typeof ORDER_STATUS[keyof typeof ORDER_STATUS];