import { prisma } from '../lib/prisma';
import { format } from 'date-fns';

export const SUPPORTED_CURRENCIES = [
  'USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'SEK', 'NZD',
  'MXN', 'SGD', 'HKD', 'NOK', 'KRW', 'TRY', 'INR', 'RUB', 'BRL', 'ZAR',
  'DKK', 'PLN', 'TWD', 'THB', 'MYR', 'IDR', 'CZK', 'ILS', 'PHP', 'KES',
];

export async function getRate(from: string, to: string, date?: Date): Promise<number> {
  if (from === to) return 1;

  const dateStr = format(date || new Date(), 'yyyy-MM-dd');
  const dateObj = new Date(dateStr);

  // Check cache
  const cached = await prisma.exchangeRate.findUnique({
    where: { fromCurrency_toCurrency_date: { fromCurrency: from, toCurrency: to, date: dateObj } },
  });
  if (cached) return cached.rate;

  // Fetch from API
  try {
    const response = await fetch(
      `https://api.frankfurter.app/${dateStr}?from=${from}&to=${to}`
    );
    if (!response.ok) throw new Error(`Frankfurter API error: ${response.status}`);
    const data = await response.json() as { rates: Record<string, number> };
    const rate = data.rates[to];
    if (!rate) throw new Error(`No rate found for ${from}->${to}`);

    // Cache it
    await prisma.exchangeRate.create({
      data: { fromCurrency: from, toCurrency: to, rate, date: dateObj },
    }).catch(() => {}); // Ignore duplicate

    return rate;
  } catch (err) {
    // Fallback: try reverse rate
    const reverse = await prisma.exchangeRate.findUnique({
      where: { fromCurrency_toCurrency_date: { fromCurrency: to, toCurrency: from, date: dateObj } },
    });
    if (reverse) return 1 / reverse.rate;

    throw err;
  }
}

export async function convertToUSD(amount: number, currency: string, date?: Date): Promise<number> {
  if (currency === 'USD') return amount;
  const rate = await getRate(currency, 'USD', date);
  return Math.round(amount * rate * 100) / 100;
}
