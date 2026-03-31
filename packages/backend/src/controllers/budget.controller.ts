import { Request, Response, NextFunction } from 'express';
import * as budgetService from '../services/budget.service';

export async function getBudgets(req: Request, res: Response, next: NextFunction) {
  try {
    const isActive = req.query.isActive === 'true' ? true : req.query.isActive === 'false' ? false : undefined;
    const data = await budgetService.getBudgets(req.user!.userId, isActive);
    res.json({ data });
  } catch (err) { next(err); }
}

export async function createBudget(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await budgetService.createBudget(req.user!.userId, req.body);
    res.status(201).json({ data });
  } catch (err) { next(err); }
}

export async function updateBudget(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await budgetService.updateBudget(req.user!.userId, Number(req.params.id), req.body);
    res.json({ data });
  } catch (err) { next(err); }
}

export async function deleteBudget(req: Request, res: Response, next: NextFunction) {
  try {
    await budgetService.deleteBudget(req.user!.userId, Number(req.params.id));
    res.sendStatus(204);
  } catch (err) { next(err); }
}
