import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const EXPENSE_CATEGORIES = [
  { name: 'Office Supplies', icon: '📎', color: '#3B82F6' },
  { name: 'Travel', icon: '✈️', color: '#8B5CF6' },
  { name: 'Meals', icon: '🍽️', color: '#F59E0B' },
  { name: 'Software', icon: '💻', color: '#10B981' },
  { name: 'Equipment', icon: '🔧', color: '#EF4444' },
  { name: 'Marketing', icon: '📢', color: '#EC4899' },
  { name: 'Insurance', icon: '🛡️', color: '#6366F1' },
  { name: 'Professional Services', icon: '👔', color: '#14B8A6' },
  { name: 'Utilities', icon: '⚡', color: '#F97316' },
  { name: 'Other Expense', icon: '📦', color: '#6B7280' },
];

const INCOME_CATEGORIES = [
  { name: 'Client Payment', icon: '💰', color: '#10B981' },
  { name: 'Consulting', icon: '🎯', color: '#3B82F6' },
  { name: 'Royalties', icon: '👑', color: '#8B5CF6' },
  { name: 'Product Sales', icon: '🛒', color: '#F59E0B' },
  { name: 'Other Income', icon: '💵', color: '#6B7280' },
];

// Deterministic pseudo-random based on seed
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

function randomBetween(rng: () => number, min: number, max: number): number {
  return Math.round((min + rng() * (max - min)) * 100) / 100;
}

function pickRandom<T>(rng: () => number, arr: T[]): T {
  return arr[Math.floor(rng() * arr.length)];
}

function dateInMonth(year: number, month: number, day: number): Date {
  const maxDay = new Date(year, month + 1, 0).getDate();
  return new Date(year, month, Math.min(day, maxDay));
}

async function main() {
  const passwordHash = await bcrypt.hash('password123', 12);
  const user = await prisma.user.upsert({
    where: { email: 'demo@obolus.dev' },
    update: {},
    create: {
      email: 'demo@obolus.dev',
      passwordHash,
      displayName: 'Alex Rivera',
    },
  });

  // Create categories
  const expenseCats: Array<{ id: number; name: string }> = [];
  const incomeCats: Array<{ id: number; name: string }> = [];

  for (const cat of EXPENSE_CATEGORIES) {
    const c = await prisma.category.upsert({
      where: { name_userId_type: { name: cat.name, userId: user.id, type: 'expense' } },
      update: {},
      create: { ...cat, type: 'expense', userId: user.id, isDefault: true },
    });
    expenseCats.push({ id: c.id, name: c.name });
  }
  for (const cat of INCOME_CATEGORIES) {
    const c = await prisma.category.upsert({
      where: { name_userId_type: { name: cat.name, userId: user.id, type: 'income' } },
      update: {},
      create: { ...cat, type: 'income', userId: user.id, isDefault: true },
    });
    incomeCats.push({ id: c.id, name: c.name });
  }

  // Clear existing seed transactions
  await prisma.transaction.deleteMany({ where: { userId: user.id } });
  await prisma.budget.deleteMany({ where: { userId: user.id } });
  await prisma.recurringRule.deleteMany({ where: { userId: user.id } });

  const rng = seededRandom(42);
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  // Generate 6 months of transactions
  const transactions: Array<{
    type: string;
    amount: number;
    currency: string;
    amountUSD: number;
    date: Date;
    description: string;
    categoryId: number;
    userId: number;
    isTaxDeductible: boolean;
  }> = [];

  // Recurring income patterns (2 main clients)
  const clients = [
    { name: 'Acme Corp', amount: 5500, catName: 'Client Payment' },
    { name: 'TechStart Inc', amount: 3200, catName: 'Consulting' },
    { name: 'DesignLab', amount: 1800, catName: 'Client Payment' },
  ];

  // Expense templates with realistic descriptions
  const expenseTemplates = [
    { catName: 'Software', descriptions: ['Figma Pro', 'GitHub Copilot', 'Notion Team', 'AWS hosting', 'Vercel Pro', 'Adobe CC'], min: 10, max: 150, deductible: true },
    { catName: 'Office Supplies', descriptions: ['Printer ink', 'Notebooks', 'USB-C hub', 'Desk lamp', 'Sticky notes', 'Cable organizer'], min: 8, max: 80, deductible: true },
    { catName: 'Meals', descriptions: ['Client lunch - Acme', 'Coffee meeting', 'Team dinner', 'Working lunch', 'Client dinner'], min: 15, max: 120, deductible: true },
    { catName: 'Travel', descriptions: ['Uber to client', 'Flight to SF', 'Hotel - SF trip', 'Parking', 'Train ticket', 'Gas'], min: 15, max: 450, deductible: true },
    { catName: 'Marketing', descriptions: ['Google Ads', 'LinkedIn premium', 'Business cards', 'Portfolio hosting', 'Domain renewal'], min: 15, max: 200, deductible: true },
    { catName: 'Equipment', descriptions: ['Mechanical keyboard', 'Monitor arm', 'Webcam HD', 'Headset'], min: 40, max: 350, deductible: true },
    { catName: 'Insurance', descriptions: ['Liability insurance', 'Health insurance premium'], min: 150, max: 450, deductible: true },
    { catName: 'Professional Services', descriptions: ['Accountant quarterly', 'Legal consultation', 'Tax filing'], min: 100, max: 500, deductible: true },
    { catName: 'Utilities', descriptions: ['Internet bill', 'Phone bill', 'Coworking space', 'Electricity (home office)'], min: 40, max: 200, deductible: true },
  ];

  for (let monthOffset = 5; monthOffset >= 0; monthOffset--) {
    const month = currentMonth - monthOffset;
    const year = month < 0 ? currentYear - 1 : currentYear;
    const adjMonth = month < 0 ? month + 12 : month;

    // Income: each client pays on a different day
    for (const client of clients) {
      // Slight variation in payment (+/- 10%)
      const variation = 1 + (rng() - 0.5) * 0.2;
      const amount = Math.round(client.amount * variation * 100) / 100;
      const cat = incomeCats.find(c => c.name === client.catName)!;
      const day = 1 + Math.floor(rng() * 15);

      transactions.push({
        type: 'income',
        amount,
        currency: 'USD',
        amountUSD: amount,
        date: dateInMonth(year, adjMonth, day),
        description: `${client.name} - ${['January','February','March','April','May','June','July','August','September','October','November','December'][adjMonth]} invoice`,
        categoryId: cat.id,
        userId: user.id,
        isTaxDeductible: false,
      });
    }

    // Occasional royalty income
    if (rng() > 0.4) {
      const cat = incomeCats.find(c => c.name === 'Royalties')!;
      transactions.push({
        type: 'income',
        amount: randomBetween(rng, 200, 600),
        currency: 'USD',
        amountUSD: randomBetween(rng, 200, 600),
        date: dateInMonth(year, adjMonth, 20 + Math.floor(rng() * 8)),
        description: 'eBook royalties - Q' + (Math.floor(adjMonth / 3) + 1),
        categoryId: cat.id,
        userId: user.id,
        isTaxDeductible: false,
      });
    }

    // Expenses: 8-15 per month
    const numExpenses = 8 + Math.floor(rng() * 8);
    for (let i = 0; i < numExpenses; i++) {
      const template = pickRandom(rng, expenseTemplates);
      const cat = expenseCats.find(c => c.name === template.catName)!;
      const description = pickRandom(rng, template.descriptions);
      const amount = randomBetween(rng, template.min, template.max);
      const day = 1 + Math.floor(rng() * 28);

      transactions.push({
        type: 'expense',
        amount,
        currency: 'USD',
        amountUSD: amount,
        date: dateInMonth(year, adjMonth, day),
        description,
        categoryId: cat.id,
        userId: user.id,
        isTaxDeductible: template.deductible,
      });
    }
  }

  // Insert all transactions
  await prisma.transaction.createMany({ data: transactions });

  const totalCreated = transactions.length;
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amountUSD, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amountUSD, 0);

  // Create budgets
  const softwareCat = expenseCats.find(c => c.name === 'Software')!;
  const mealsCat = expenseCats.find(c => c.name === 'Meals')!;
  const travelCat = expenseCats.find(c => c.name === 'Travel')!;
  const marketingCat = expenseCats.find(c => c.name === 'Marketing')!;

  await prisma.budget.createMany({
    data: [
      { name: 'Software & Tools', amount: 300, currency: 'USD', period: 'monthly', categoryId: softwareCat.id, userId: user.id, startDate: new Date(currentYear, 0, 1), isActive: true },
      { name: 'Client Meals', amount: 400, currency: 'USD', period: 'monthly', categoryId: mealsCat.id, userId: user.id, startDate: new Date(currentYear, 0, 1), isActive: true },
      { name: 'Travel Budget', amount: 1500, currency: 'USD', period: 'quarterly', categoryId: travelCat.id, userId: user.id, startDate: new Date(currentYear, 0, 1), isActive: true },
      { name: 'Marketing Spend', amount: 500, currency: 'USD', period: 'monthly', categoryId: marketingCat.id, userId: user.id, startDate: new Date(currentYear, 0, 1), isActive: true },
    ],
  });

  // Create recurring rules
  const insuranceCat = expenseCats.find(c => c.name === 'Insurance')!;
  const utilitiesCat = expenseCats.find(c => c.name === 'Utilities')!;
  const clientPaymentCat = incomeCats.find(c => c.name === 'Client Payment')!;

  const nextMonth = new Date(currentYear, currentMonth + 1, 1);

  await prisma.recurringRule.createMany({
    data: [
      { type: 'expense', amount: 350, currency: 'USD', description: 'Health insurance premium', categoryId: insuranceCat.id, frequency: 'monthly', dayOfMonth: 1, nextRunDate: nextMonth, isActive: true, userId: user.id },
      { type: 'expense', amount: 89, currency: 'USD', description: 'Internet bill', categoryId: utilitiesCat.id, frequency: 'monthly', dayOfMonth: 15, nextRunDate: new Date(currentYear, currentMonth + 1, 15), isActive: true, userId: user.id },
      { type: 'expense', amount: 49, currency: 'USD', description: 'Coworking day pass (weekly)', categoryId: utilitiesCat.id, frequency: 'weekly', nextRunDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), isActive: true, userId: user.id },
      { type: 'income', amount: 5500, currency: 'USD', description: 'Acme Corp retainer', categoryId: clientPaymentCat.id, frequency: 'monthly', dayOfMonth: 5, nextRunDate: new Date(currentYear, currentMonth + 1, 5), isActive: true, userId: user.id },
    ],
  });

  console.log(`Seed complete: demo@obolus.dev / password123`);
  console.log(`  ${totalCreated} transactions (${transactions.filter(t => t.type === 'income').length} income, ${transactions.filter(t => t.type === 'expense').length} expenses)`);
  console.log(`  Total income: $${totalIncome.toFixed(2)}`);
  console.log(`  Total expenses: $${totalExpenses.toFixed(2)}`);
  console.log(`  4 budgets, 4 recurring rules`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
