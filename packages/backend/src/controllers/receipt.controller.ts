import { Request, Response, NextFunction } from 'express';
import * as receiptService from '../services/receipt.service';

export async function uploadReceipt(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }
    const data = await receiptService.uploadReceipt(req.user!.userId, Number(req.params.transactionId), req.file);
    res.status(201).json({ data });
  } catch (err) { next(err); }
}

export async function getReceipt(req: Request, res: Response, next: NextFunction) {
  try {
    const receipt = await receiptService.getReceipt(req.user!.userId, Number(req.params.transactionId));
    res.setHeader('Content-Type', receipt.mimeType);
    res.sendFile(receipt.path, { root: '/' });
  } catch (err) { next(err); }
}

export async function deleteReceipt(req: Request, res: Response, next: NextFunction) {
  try {
    await receiptService.deleteReceipt(req.user!.userId, Number(req.params.transactionId));
    res.sendStatus(204);
  } catch (err) { next(err); }
}
