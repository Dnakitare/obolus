import { Request, Response, NextFunction } from 'express';
import { SUPPORTED_CURRENCIES, getRate } from '../services/currency.service';

export async function getCurrencies(_req: Request, res: Response, _next: NextFunction) {
  res.json({ data: SUPPORTED_CURRENCIES });
}

export async function getExchangeRate(req: Request, res: Response, next: NextFunction) {
  try {
    const { from, to, date } = req.query as Record<string, string>;
    const rate = await getRate(from, to, date ? new Date(date) : undefined);
    res.json({ from, to, rate, date: date || new Date().toISOString().split('T')[0] });
  } catch (err) { next(err); }
}
