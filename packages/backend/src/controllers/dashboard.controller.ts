import { Request, Response, NextFunction } from 'express';
import * as dashboardService from '../services/dashboard.service';

export async function getSummary(req: Request, res: Response, next: NextFunction) {
  try {
    const { period = 'current_month', startDate, endDate } = req.query as Record<string, string>;
    const data = await dashboardService.getSummary(req.user!.userId, period, startDate, endDate);
    res.json({ data });
  } catch (err) { next(err); }
}

export async function getTrends(req: Request, res: Response, next: NextFunction) {
  try {
    const months = Number(req.query.months) || 6;
    const data = await dashboardService.getTrends(req.user!.userId, months);
    res.json({ data });
  } catch (err) { next(err); }
}

export async function getCategoryBreakdown(req: Request, res: Response, next: NextFunction) {
  try {
    const { type = 'expense', period = 'current_month', startDate, endDate } = req.query as Record<string, string>;
    const data = await dashboardService.getCategoryBreakdown(req.user!.userId, type, period, startDate, endDate);
    res.json({ data });
  } catch (err) { next(err); }
}

export async function getBudgetStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await dashboardService.getBudgetStatus(req.user!.userId);
    res.json({ data });
  } catch (err) { next(err); }
}
