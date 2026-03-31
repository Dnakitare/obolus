import { prisma } from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';
import type { CreateCategoryInput, UpdateCategoryInput } from '../schemas/category.schema';

export async function getCategories(userId: number, type?: string) {
  const where: { userId: number; type?: string } = { userId };
  if (type) where.type = type;
  return prisma.category.findMany({ where, orderBy: { name: 'asc' } });
}

export async function createCategory(userId: number, input: CreateCategoryInput) {
  const existing = await prisma.category.findUnique({
    where: { name_userId_type: { name: input.name, userId, type: input.type } },
  });
  if (existing) throw new AppError(409, 'Category already exists');

  return prisma.category.create({ data: { ...input, userId } });
}

export async function updateCategory(userId: number, id: number, input: UpdateCategoryInput) {
  const category = await prisma.category.findFirst({ where: { id, userId } });
  if (!category) throw new AppError(404, 'Category not found');

  return prisma.category.update({ where: { id }, data: input });
}

export async function deleteCategory(userId: number, id: number) {
  const category = await prisma.category.findFirst({ where: { id, userId } });
  if (!category) throw new AppError(404, 'Category not found');

  const txCount = await prisma.transaction.count({ where: { categoryId: id } });
  if (txCount > 0) {
    throw new AppError(400, `Cannot delete category with ${txCount} transactions. Reassign them first.`);
  }

  await prisma.category.delete({ where: { id } });
}
