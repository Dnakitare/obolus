import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z.string().min(1).max(100),
  type: z.enum(['income', 'expense']),
  icon: z.string().max(10).optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Must be a hex color').optional(),
});

export const updateCategorySchema = createCategorySchema.partial().omit({ type: true });

export const categoryQuerySchema = z.object({
  type: z.enum(['income', 'expense']).optional(),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
