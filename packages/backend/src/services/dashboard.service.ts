import { prisma } from '../lib/prisma';
import {
  startOfMonth, endOfMonth, startOfQuarter, endOfQuarter,
  startOfYear, endOfYear, subMonths, format,
} from 'date-fns';

interface PeriodRange {
  start: Date;
  end: Date;
}

function getPeriodRange(period: string, startDate?: string, endDate?: string): PeriodRange {
  const now = new Date();
  switch (period) {
    case 'current_month':
      return { start: startOfMonth(now), end: endOfMonth(now) };
    case 'current_quarter':
      return { start: startOfQuarter(now), end: endOfQuarter(now) };
    case 'current_year':
      return { start: startOfYear(now), end: endOfYear(now) };
    case 'custom':
      return {
        start: startDate ? new Date(startDate) : startOfMonth(now),
        end: endDate ? new Date(endDate) : endOfMonth(now),
      };
    default:
      return { start: startOfMonth(now), end: endOfMonth(now) };
  }
}

export async function getSummary(userId: number, period: string, startDate?: string, endDate?: string) {
  const { start, end } = getPeriodRange(period, startDate, endDate);

  const [income, expenses, count] = await Promise.all([
    prisma.transaction.aggregate({
      where: { userId, type: 'income', date: { gte: start, lte: end } },
      _sum: { amountUSD: true },
    }),
    prisma.transaction.aggregate({
      where: { userId, type: 'expense', date: { gte: start, lte: end } },
      _sum: { amountUSD: true },
    }),
    prisma.transaction.count({
      where: { userId, date: { gte: start, lte: end } },
    }),
  ]);

  const totalIncome = income._sum.amountUSD || 0;
  const totalExpenses = expenses._sum.amountUSD || 0;

  return {
    totalIncome,
    totalExpenses,
    netIncome: totalIncome - totalExpenses,
    transactionCount: count,
    period: { start, end },
  };
}

export async function getTrends(userId: number, months: number = 6) {
  const data: Array<{ month: string; income: number; expenses: number }> = [];

  for (let i = months - 1; i >= 0; i--) {
    const date = subMonths(new Date(), i);
    const start = startOfMonth(date);
    const end = endOfMonth(date);

    const [income, expenses] = await Promise.all([
      prisma.transaction.aggregate({
        where: { userId, type: 'income', date: { gte: start, lte: end } },
        _sum: { amountUSD: true },
      }),
      prisma.transaction.aggregate({
        where: { userId, type: 'expense', date: { gte: start, lte: end } },
        _sum: { amountUSD: true },
      }),
    ]);

    data.push({
      month: format(date, 'yyyy-MM'),
      income: income._sum.amountUSD || 0,
      expenses: expenses._sum.amountUSD || 0,
    });
  }

  return data;
}

export async function getCategoryBreakdown(userId: number, type: string, period: string, startDate?: string, endDate?: string) {
  const { start, end } = getPeriodRange(period, startDate, endDate);

  const transactions = await prisma.transaction.groupBy({
    by: ['categoryId'],
    where: { userId, type, date: { gte: start, lte: end } },
    _sum: { amountUSD: true },
  });

  const total = transactions.reduce((sum, t) => sum + (t._sum.amountUSD || 0), 0);

  const categories = await prisma.category.findMany({
    where: { id: { in: transactions.map(t => t.categoryId) } },
    select: { id: true, name: true, color: true, icon: true },
  });

  const categoryMap = new Map(categories.map(c => [c.id, c]));

  return transactions
    .map(t => {
      const cat = categoryMap.get(t.categoryId);
      const amount = t._sum.amountUSD || 0;
      return {
        categoryId: t.categoryId,
        categoryName: cat?.name || 'Unknown',
        color: cat?.color || '#6B7280',
        icon: cat?.icon || '📦',
        total: amount,
        percentage: total > 0 ? Math.round((amount / total) * 100) : 0,
      };
    })
    .sort((a, b) => b.total - a.total);
}

export async function getBudgetStatus(userId: number) {
  const budgets = await prisma.budget.findMany({
    where: { userId, isActive: true },
    include: { category: { select: { id: true, name: true, icon: true, color: true } } },
  });

  return Promise.all(
    budgets.map(async (budget) => {
      const now = new Date();
      let start: Date;
      let end: Date;

      switch (budget.period) {
        case 'monthly':
          start = startOfMonth(now);
          end = endOfMonth(now);
          break;
        case 'quarterly':
          start = startOfQuarter(now);
          end = endOfQuarter(now);
          break;
        case 'yearly':
          start = startOfYear(now);
          end = endOfYear(now);
          break;
        default:
          start = startOfMonth(now);
          end = endOfMonth(now);
      }

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

      return {
        budgetId: budget.id,
        name: budget.name,
        category: budget.category,
        limit: budget.amount,
        spent: totalSpent,
        remaining: Math.max(0, budget.amount - totalSpent),
        percentUsed: Math.round((totalSpent / budget.amount) * 100),
        period: budget.period,
      };
    })
  );
}
