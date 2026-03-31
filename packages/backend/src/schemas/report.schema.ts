import { z } from 'zod';

export const taxSummarySchema = z.object({
  year: z.coerce.number().int().min(2000).max(2100),
});

export const exportQuerySchema = z.object({
  type: z.enum(['income', 'expense']).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export type TaxSummaryQuery = z.infer<typeof taxSummarySchema>;
export type ExportQuery = z.infer<typeof exportQuerySchema>;
