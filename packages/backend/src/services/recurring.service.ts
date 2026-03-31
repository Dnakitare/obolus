import { prisma } from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';
import { convertToUSD } from './currency.service';
import { addDays, addWeeks, addMonths, addYears } from 'date-fns';
import type { CreateRecurringInput, UpdateRecurringInput } from '../schemas/recurring.schema';

export async function getRules(userId: number, isActive?: boolean) {
  const where: { userId: number; isActive?: boolean } = { userId };
  if (isActive !== undefined) where.isActive = isActive;
  return prisma.recurringRule.findMany({ where, orderBy: { nextRunDate: 'asc' } });
}

export async function createRule(userId: number, input: CreateRecurringInput) {
  const category = await prisma.category.findFirst({
    where: { id: input.categoryId, userId, type: input.type },
  });
  if (!category) throw new AppError(400, 'Invalid category for this transaction type');

  const { startDate, endDate, ...rest } = input;
  return prisma.recurringRule.create({
    data: {
      ...rest,
      nextRunDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : null,
      userId,
    },
  });
}

export async function updateRule(userId: number, id: number, input: UpdateRecurringInput) {
  const rule = await prisma.recurringRule.findFirst({ where: { id, userId } });
  if (!rule) throw new AppError(404, 'Recurring rule not found');

  const { startDate, endDate, ...rest } = input;
  return prisma.recurringRule.update({
    where: { id },
    data: {
      ...rest,
      nextRunDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    },
  });
}

export async function deleteRule(userId: number, id: number) {
  const rule = await prisma.recurringRule.findFirst({ where: { id, userId } });
  if (!rule) throw new AppError(404, 'Recurring rule not found');
  await prisma.recurringRule.delete({ where: { id } });
}

export function computeNextRunDate(frequency: string, fromDate: Date, dayOfMonth?: number | null, dayOfWeek?: number | null): Date {
  switch (frequency) {
    case 'daily':
      return addDays(fromDate, 1);
    case 'weekly':
      return addWeeks(fromDate, 1);
    case 'biweekly':
      return addWeeks(fromDate, 2);
    case 'monthly': {
      const next = addMonths(fromDate, 1);
      if (dayOfMonth) {
        const maxDay = new Date(next.getFullYear(), next.getMonth() + 1, 0).getDate();
        next.setDate(Math.min(dayOfMonth, maxDay));
      }
      return next;
    }
    case 'quarterly':
      return addMonths(fromDate, 3);
    case 'yearly':
      return addYears(fromDate, 1);
    default:
      return addMonths(fromDate, 1);
  }
}

export async function processRecurringRules(userId?: number) {
  const now = new Date();
  const where: { isActive: boolean; nextRunDate: { lte: Date }; userId?: number } = {
    isActive: true,
    nextRunDate: { lte: now },
  };
  if (userId) where.userId = userId;

  const rules = await prisma.recurringRule.findMany({ where });
  let created = 0;

  for (const rule of rules) {
    // Check if end date has passed
    if (rule.endDate && rule.endDate < now) {
      await prisma.recurringRule.update({
        where: { id: rule.id },
        data: { isActive: false },
      });
      continue;
    }

    const amountUSD = await convertToUSD(rule.amount, rule.currency, now);

    await prisma.transaction.create({
      data: {
        type: rule.type,
        amount: rule.amount,
        currency: rule.currency,
        amountUSD,
        date: rule.nextRunDate,
        description: rule.description,
        categoryId: rule.categoryId,
        userId: rule.userId,
        recurringRuleId: rule.id,
      },
    });

    const nextRunDate = computeNextRunDate(rule.frequency, rule.nextRunDate, rule.dayOfMonth, rule.dayOfWeek);

    await prisma.recurringRule.update({
      where: { id: rule.id },
      data: { lastRunDate: rule.nextRunDate, nextRunDate },
    });

    created++;
  }

  return { created };
}
