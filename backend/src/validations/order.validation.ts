import { z } from 'zod';

export const createOrderSchema = z.object({
  body: z.object({
    description: z.string().min(1, 'Description is required'),
    specifications: z.string().min(1, 'Specifications are required'),
    quantity: z.number().min(1, 'Quantity must be at least 1'),
  }),
});

export const updateOrderStatusSchema = z.object({
  body: z.object({
    status: z.enum(['review', 'processing', 'completed']),
  }),
});