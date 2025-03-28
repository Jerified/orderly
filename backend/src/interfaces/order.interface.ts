import { Document } from 'mongoose';
import { UserRole } from './user.interface';

export const OrderStatus = {
  REVIEW: 'review',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
} as const;

export type OrderStatus = typeof OrderStatus[keyof typeof OrderStatus];

export interface IOrder {
  user: string;
  description: string;
  specifications: string;
  quantity: number;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface IOrderDocument extends IOrder, Document {}