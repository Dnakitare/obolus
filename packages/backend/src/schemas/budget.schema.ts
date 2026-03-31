import { z } from 'zod';

export const createBudgetSchema = z.object({
  name: z.string().min(1).max(100),
  amount: z.number().positive(),
  currency: z.string().length(3).default('USD'),
  period: z.enum(['monthly', 'quarterly', 'yearly']),
  categoryId: z.number().int().positive(),
  startDate: z.string().pipe(z.coerce.date()),
  endDate: z.string().pipe(z.coerce.date()).optional(),
});

export const updateBudgetSchema = createBudgetSchema.partial();

export type CreateBudgetInput = z.infer<typeof createBudgetSchema>;
export type UpdateBudgetInput = z.infer<typeof updateBudgetSchema>;
