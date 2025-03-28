import { z } from 'zod';

export const closeChatSchema = z.object({
  body: z.object({
    summary: z.string().min(1, 'Summary is required'),
  }),
});