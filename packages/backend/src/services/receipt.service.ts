import fs from 'fs';
import path from 'path';
import { prisma } from '../lib/prisma';
import { AppError } from '../middleware/errorHandler';

export async function uploadReceipt(userId: number, transactionId: number, file: Express.Multer.File) {
  const transaction = await prisma.transaction.findFirst({ where: { id: transactionId, userId } });
  if (!transaction) throw new AppError(404, 'Transaction not found');

  // Delete existing receipt if any
  if (transaction.receiptPath) {
    try {
      fs.unlinkSync(transaction.receiptPath);
    } catch {
      // File may not exist
    }
  }

  const updated = await prisma.transaction.update({
    where: { id: transactionId },
    data: {
      receiptPath: file.path,
      receiptMimeType: file.mimetype,
    },
  });

  return {
    transactionId: updated.id,
    filename: file.originalname,
    mimeType: file.mimetype,
    size: file.size,
  };
}

export async function getReceipt(userId: number, transactionId: number) {
  const transaction = await prisma.transaction.findFirst({ where: { id: transactionId, userId } });
  if (!transaction) throw new AppError(404, 'Transaction not found');
  if (!transaction.receiptPath) throw new AppError(404, 'No receipt attached');

  if (!fs.existsSync(transaction.receiptPath)) {
    throw new AppError(404, 'Receipt file not found on disk');
  }

  return {
    path: transaction.receiptPath,
    mimeType: transaction.receiptMimeType || 'application/octet-stream',
    filename: path.basename(transaction.receiptPath),
  };
}

export async function deleteReceipt(userId: number, transactionId: number) {
  const transaction = await prisma.transaction.findFirst({ where: { id: transactionId, userId } });
  if (!transaction) throw new AppError(404, 'Transaction not found');
  if (!transaction.receiptPath) throw new AppError(404, 'No receipt attached');

  try {
    fs.unlinkSync(transaction.receiptPath);
  } catch {
    // File may not exist
  }

  await prisma.transaction.update({
    where: { id: transactionId },
    data: { receiptPath: null, receiptMimeType: null },
  });
}
