import { prisma } from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';
import { getPeriodWindow } from './transaction.service';
import type { CreateBudgetInput, UpdateBudgetInput } from '../schemas/budget.schema';

export async function getBudgets(userId: number, isActive?: boolean) {
  const where: { userId: number; isActive?: boolean } = { userId };
  if (isActive !== undefined) where.isActive = isActive;

  const budgets = await prisma.budget.findMany({
    where,
    include: { category: { select: { id: true, name: true, icon: true, color: true } } },
    orderBy: { createdAt: 'desc' },
  });

  // Compute spent for each budget
  const budgetsWithSpent = await Promise.all(
    budgets.map(async (budget) => {
      const { start, end } = getPeriodWindow(budget.period, budget.startDate, new Date());
      const spent = await prisma.transaction.aggregate({
        where: {
          userId,
          type: 'expense',
          categoryId: budget.categoryId,
          date: { gte: start, lte: end },
        },
        _sum: { amountUSD: true },
      });

      const totalSpent = spent._sum.amountUSD || 0;
      const percentUsed = Math.round((totalSpent / budget.amount) * 100);

      return {
        ...budget,
        spent: totalSpent,
        remaining: Math.max(0, budget.amount - totalSpent),
        percentUsed,
      };
    })
  );

  return budgetsWithSpent;
}

export async function createBudget(userId: number, input: CreateBudgetInput) {
  const category = await prisma.category.findFirst({
    where: { id: input.categoryId, userId, type: 'expense' },
  });
  if (!category) throw new AppError(400, 'Invalid expense category');

  return prisma.budget.create({
    data: {
      ...input,
      startDate: new Date(input.startDate),
      endDate: input.endDate ? new Date(input.endDate) : null,
      userId,
    },
    include: { category: { select: { id: true, name: true, icon: true, color: true } } },
  });
}

export async function updateBudget(userId: number, id: number, input: UpdateBudgetInput) {
  const budget = await prisma.budget.findFirst({ where: { id, userId } });
  if (!budget) throw new AppError(404, 'Budget not found');

  return prisma.budget.update({
    where: { id },
    data: {
      ...input,
      startDate: input.startDate ? new Date(input.startDate) : undefined,
      endDate: input.endDate ? new Date(input.endDate) : undefined,
    },
    include: { category: { select: { id: true, name: true, icon: true, color: true } } },
  });
}

export async function deleteBudget(userId: number, id: number) {
  const budget = await prisma.budget.findFirst({ where: { id, userId } });
  if (!budget) throw new AppError(404, 'Budget not found');
  await prisma.budget.delete({ where: { id } });
}
