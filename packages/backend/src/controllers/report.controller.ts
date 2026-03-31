import { Request, Response, NextFunction } from 'express';
import * as reportService from '../services/report.service';

export async function getTaxSummary(req: Request, res: Response, next: NextFunction) {
  try {
    const year = Number(req.query.year);
    const data = await reportService.getTaxSummary(req.user!.userId, year);
    res.json({ data });
  } catch (err) { next(err); }
}

export async function exportCSV(req: Request, res: Response, next: NextFunction) {
  try {
    const { type, startDate, endDate } = req.query as Record<string, string>;
    const csv = await reportService.exportCSV(req.user!.userId, type, startDate, endDate);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="obolus-export.csv"');
    res.send(csv);
  } catch (err) { next(err); }
}

export async function exportPDF(req: Request, res: Response, next: NextFunction) {
  try {
    const { type, startDate, endDate } = req.query as Record<string, string>;
    const pdf = await reportService.exportPDF(req.user!.userId, type, startDate, endDate);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="obolus-report.pdf"');
    res.send(pdf);
  } catch (err) { next(err); }
}
