import { prisma } from '../lib/prisma';
import { format as csvFormat } from 'fast-csv';
import PDFDocument from 'pdfkit';
import { Writable } from 'stream';

export async function getTaxSummary(userId: number, year: number) {
  const start = new Date(year, 0, 1);
  const end = new Date(year, 11, 31, 23, 59, 59);

  const [totalIncome, totalDeductible, deductibleByCategory, allTransactions] = await Promise.all([
    prisma.transaction.aggregate({
      where: { userId, type: 'income', date: { gte: start, lte: end } },
      _sum: { amountUSD: true },
    }),
    prisma.transaction.aggregate({
      where: { userId, type: 'expense', isTaxDeductible: true, date: { gte: start, lte: end } },
      _sum: { amountUSD: true },
    }),
    prisma.transaction.groupBy({
      by: ['categoryId'],
      where: { userId, type: 'expense', isTaxDeductible: true, date: { gte: start, lte: end } },
      _sum: { amountUSD: true },
      _count: true,
    }),
    prisma.transaction.findMany({
      where: { userId, date: { gte: start, lte: end } },
      include: { category: { select: { name: true } } },
      orderBy: { date: 'asc' },
    }),
  ]);

  const categories = await prisma.category.findMany({
    where: { id: { in: deductibleByCategory.map(d => d.categoryId) } },
    select: { id: true, name: true },
  });
  const catMap = new Map(categories.map(c => [c.id, c.name]));

  // Quarterly breakdown
  const quarters = [0, 1, 2, 3].map(q => {
    const qStart = new Date(year, q * 3, 1);
    const qEnd = new Date(year, q * 3 + 3, 0, 23, 59, 59);
    const qTransactions = allTransactions.filter(t => t.date >= qStart && t.date <= qEnd);

    const income = qTransactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amountUSD, 0);
    const expenses = qTransactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amountUSD, 0);
    const deductible = qTransactions.filter(t => t.type === 'expense' && t.isTaxDeductible).reduce((s, t) => s + t.amountUSD, 0);

    return { quarter: `Q${q + 1}`, income, expenses, deductible, net: income - expenses };
  });

  return {
    year,
    totalIncome: totalIncome._sum.amountUSD || 0,
    totalDeductible: totalDeductible._sum.amountUSD || 0,
    deductibleByCategory: deductibleByCategory.map(d => ({
      categoryName: catMap.get(d.categoryId) || 'Unknown',
      total: d._sum.amountUSD || 0,
      count: d._count,
    })),
    quarterlyBreakdown: quarters,
  };
}

export async function exportCSV(userId: number, type?: string, startDate?: string, endDate?: string): Promise<string> {
  const where: Record<string, unknown> = { userId };
  if (type) where.type = type;
  if (startDate || endDate) {
    where.date = {};
    if (startDate) (where.date as Record<string, unknown>).gte = new Date(startDate);
    if (endDate) (where.date as Record<string, unknown>).lte = new Date(endDate);
  }

  const transactions = await prisma.transaction.findMany({
    where: where as never,
    include: { category: { select: { name: true } } },
    orderBy: { date: 'asc' },
  });

  return new Promise((resolve, reject) => {
    let output = '';
    const stream = csvFormat({ headers: true });
    const writable = new Writable({
      write(chunk, _encoding, callback) {
        output += chunk.toString();
        callback();
      },
    });

    stream.pipe(writable);

    writable.on('finish', () => resolve(output));
    stream.on('error', reject);

    for (const t of transactions) {
      stream.write({
        Date: t.date.toISOString().split('T')[0],
        Type: t.type,
        Amount: t.amount,
        Currency: t.currency,
        'Amount (USD)': t.amountUSD,
        Category: t.category.name,
        Description: t.description,
        'Tax Deductible': t.isTaxDeductible ? 'Yes' : 'No',
        Notes: t.notes || '',
      });
    }

    stream.end();
  });
}

export async function exportPDF(userId: number, type?: string, startDate?: string, endDate?: string): Promise<Buffer> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  const where: Record<string, unknown> = { userId };
  if (type) where.type = type;
  if (startDate || endDate) {
    where.date = {};
    if (startDate) (where.date as Record<string, unknown>).gte = new Date(startDate);
    if (endDate) (where.date as Record<string, unknown>).lte = new Date(endDate);
  }

  const transactions = await prisma.transaction.findMany({
    where: where as never,
    include: { category: { select: { name: true } } },
    orderBy: { date: 'asc' },
  });

  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    const doc = new PDFDocument({ margin: 50 });

    doc.on('data', (chunk: Buffer) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    // Header
    doc.fontSize(20).text('Obolus Financial Report', { align: 'center' });
    doc.fontSize(10).text(`Generated for: ${user?.displayName || 'User'}`, { align: 'center' });
    doc.text(`Date: ${new Date().toLocaleDateString()}`, { align: 'center' });
    doc.moveDown(2);

    // Summary
    const totalIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amountUSD, 0);
    const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amountUSD, 0);

    doc.fontSize(14).text('Summary');
    doc.fontSize(10);
    doc.text(`Total Income: $${totalIncome.toFixed(2)}`);
    doc.text(`Total Expenses: $${totalExpenses.toFixed(2)}`);
    doc.text(`Net: $${(totalIncome - totalExpenses).toFixed(2)}`);
    doc.text(`Transactions: ${transactions.length}`);
    doc.moveDown(2);

    // Transaction list
    doc.fontSize(14).text('Transactions');
    doc.moveDown();
    doc.fontSize(8);

    for (const t of transactions) {
      const line = `${t.date.toISOString().split('T')[0]}  ${t.type.padEnd(8)}  $${t.amountUSD.toFixed(2).padStart(10)}  ${t.category.name.padEnd(20)}  ${t.description}`;
      doc.text(line);
      if (doc.y > 700) {
        doc.addPage();
      }
    }

    doc.end();
  });
}
