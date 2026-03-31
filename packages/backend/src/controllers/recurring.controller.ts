import { Request, Response, NextFunction } from 'express';
import * as recurringService from '../services/recurring.service';

export async function getRules(req: Request, res: Response, next: NextFunction) {
  try {
    const isActive = req.query.isActive === 'true' ? true : req.query.isActive === 'false' ? false : undefined;
    const data = await recurringService.getRules(req.user!.userId, isActive);
    res.json({ data });
  } catch (err) { next(err); }
}

export async function createRule(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await recurringService.createRule(req.user!.userId, req.body);
    res.status(201).json({ data });
  } catch (err) { next(err); }
}

export async function updateRule(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await recurringService.updateRule(req.user!.userId, Number(req.params.id), req.body);
    res.json({ data });
  } catch (err) { next(err); }
}

export async function deleteRule(req: Request, res: Response, next: NextFunction) {
  try {
    await recurringService.deleteRule(req.user!.userId, Number(req.params.id));
    res.sendStatus(204);
  } catch (err) { next(err); }
}

export async function processRules(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await recurringService.processRecurringRules(req.user!.userId);
    res.json(result);
  } catch (err) { next(err); }
}
