import { Request, Response, NextFunction } from 'express';
import * as transactionService from '../services/transaction.service';

export async function getTransactions(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await transactionService.getTransactions(req.user!.userId, req.query as never);
    res.json(result);
  } catch (err) { next(err); }
}

export async function getTransaction(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await transactionService.getTransaction(req.user!.userId, Number(req.params.id));
    res.json({ data });
  } catch (err) { next(err); }
}

export async function createTransaction(req: Request, res: Response, next: NextFunction) {
  try {
    const { transaction, warnings } = await transactionService.createTransaction(req.user!.userId, req.body);
    res.status(201).json({ data: transaction, warnings });
  } catch (err) { next(err); }
}

export async function updateTransaction(req: Request, res: Response, next: NextFunction) {
  try {
    const { transaction, warnings } = await transactionService.updateTransaction(req.user!.userId, Number(req.params.id), req.body);
    res.json({ data: transaction, warnings });
  } catch (err) { next(err); }
}

export async function deleteTransaction(req: Request, res: Response, next: NextFunction) {
  try {
    await transactionService.deleteTransaction(req.user!.userId, Number(req.params.id));
    res.sendStatus(204);
  } catch (err) { next(err); }
}
