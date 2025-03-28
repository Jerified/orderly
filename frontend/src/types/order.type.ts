import { User } from "./user.type";

export type OrderStatus = 'review' | 'processing' | 'completed';

export interface Order {
  _id: string;
  user: string | User;
  description: string;
  specifications: string;
  quantity: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderFormData {
  description: string;
  specifications: string;
  quantity: number;
}

export interface UpdateOrderStatusFormData {
  status: OrderStatus;
}