import { prisma } from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';
import { convertToUSD } from './currency.service';
import type { CreateTransactionInput, UpdateTransactionInput, TransactionQuery } from '../schemas/transaction.schema';
import type { Prisma } from '@prisma/client';

export async function getTransactions(userId: number, query: TransactionQuery) {
  const where: Prisma.TransactionWhereInput = { userId };

  if (query.type) where.type = query.type;
  if (query.categoryId) where.categoryId = query.categoryId;
  if (query.startDate || query.endDate) {
    where.date = {};
    if (query.startDate) where.date.gte = new Date(query.startDate);
    if (query.endDate) where.date.lte = new Date(query.endDate);
  }
  if (query.search) {
    where.description = { contains: query.search };
  }

  const [data, total] = await Promise.all([
    prisma.transaction.findMany({
      where,
      include: { category: { select: { id: true, name: true, icon: true, color: true } } },
      orderBy: { [query.sortBy]: query.sortOrder },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
    }),
    prisma.transaction.count({ where }),
  ]);

  return {
    data,
    meta: {
      total,
      page: query.page,
      limit: query.limit,
      totalPages: Math.ceil(total / query.limit),
    },
  };
}

export async function getTransaction(userId: number, id: number) {
  const transaction = await prisma.transaction.findFirst({
    where: { id, userId },
    include: { category: { select: { id: true, name: true, icon: true, color: true } } },
  });
  if (!transaction) throw new AppError(404, 'Transaction not found');
  return transaction;
}

export async function createTransaction(userId: number, input: CreateTransactionInput) {
  // Verify category belongs to user and matches type
  const category = await prisma.category.findFirst({
    where: { id: input.categoryId, userId, type: input.type },
  });
  if (!category) throw new AppError(400, 'Invalid category for this transaction type');

  const amountUSD = await convertToUSD(input.amount, input.currency, input.date);

  const transaction = await prisma.transaction.create({
    data: {
      ...input,
      date: new Date(input.date),
      amountUSD,
      userId,
    },
    include: { category: { select: { id: true, name: true, icon: true, color: true } } },
  });

  // Check budget warnings
  const warnings = await checkBudgetWarnings(userId, transaction);

  return { transaction, warnings };
}

export async function updateTransaction(userId: number, id: number, input: UpdateTransactionInput) {
  const existing = await prisma.transaction.findFirst({ where: { id, userId } });
  if (!existing) throw new AppError(404, 'Transaction not found');

  const currency = input.currency || existing.currency;
  const amount = input.amount || existing.amount;
  const date = input.date ? new Date(input.date) : existing.date;
  const amountUSD = await convertToUSD(amount, currency, date);

  if (input.categoryId && input.type) {
    const category = await prisma.category.findFirst({
      where: { id: input.categoryId, userId, type: input.type },
    });
    if (!category) throw new AppError(400, 'Invalid category for this transaction type');
  }

  const transaction = await prisma.transaction.update({
    where: { id },
    data: {
      ...input,
      date,
      amountUSD,
    },
    include: { category: { select: { id: true, name: true, icon: true, color: true } } },
  });

  return { transaction, warnings: [] };
}

export async function deleteTransaction(userId: number, id: number) {
  const existing = await prisma.transaction.findFirst({ where: { id, userId } });
  if (!existing) throw new AppError(404, 'Transaction not found');
  await prisma.transaction.delete({ where: { id } });
}

async function checkBudgetWarnings(userId: number, transaction: { type: string; categoryId: number; date: Date }) {
  if (transaction.type !== 'expense') return [];

  const budgets = await prisma.budget.findMany({
    where: { userId, categoryId: transaction.categoryId, isActive: true },
  });

  const warnings: Array<{ budgetId: number; name: string; percentUsed: number }> = [];

  for (const budget of budgets) {
    const { start, end } = getPeriodWindow(budget.period, budget.startDate, transaction.date);
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

    if (percentUsed >= 80) {
      warnings.push({ budgetId: budget.id, name: budget.name, percentUsed });
    }
  }

  return warnings;
}

function getPeriodWindow(period: string, startDate: Date, referenceDate: Date) {
  const ref = new Date(referenceDate);
  let start: Date;
  let end: Date;

  switch (period) {
    case 'monthly':
      start = new Date(ref.getFullYear(), ref.getMonth(), 1);
      end = new Date(ref.getFullYear(), ref.getMonth() + 1, 0, 23, 59, 59);
      break;
    case 'quarterly': {
      const quarter = Math.floor(ref.getMonth() / 3);
      start = new Date(ref.getFullYear(), quarter * 3, 1);
      end = new Date(ref.getFullYear(), quarter * 3 + 3, 0, 23, 59, 59);
      break;
    }
    case 'yearly':
      start = new Date(ref.getFullYear(), 0, 1);
      end = new Date(ref.getFullYear(), 11, 31, 23, 59, 59);
      break;
    default:
      start = startDate;
      end = ref;
  }

  return { start, end };
}

export { getPeriodWindow };
