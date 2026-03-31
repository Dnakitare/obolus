import { z } from 'zod';
import { paginationSchema } from './common.schema';

export const createTransactionSchema = z.object({
  type: z.enum(['income', 'expense']),
  amount: z.number().positive('Amount must be positive'),
  currency: z.string().length(3).default('USD'),
  date: z.string().pipe(z.coerce.date()),
  description: z.string().min(1, 'Description is required').max(500),
  notes: z.string().max(2000).optional(),
  categoryId: z.number().int().positive(),
  isTaxDeductible: z.boolean().default(false),
});

export const updateTransactionSchema = createTransactionSchema.partial();

export const transactionQuerySchema = paginationSchema.extend({
  type: z.enum(['income', 'expense']).optional(),
  categoryId: z.coerce.number().int().positive().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  search: z.string().optional(),
  sortBy: z.enum(['date', 'amount', 'createdAt']).default('date'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
export type UpdateTransactionInput = z.infer<typeof updateTransactionSchema>;
export type TransactionQuery = z.infer<typeof transactionQuerySchema>;
