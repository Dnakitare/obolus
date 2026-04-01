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

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

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

  await prisma.transaction.deleteMany({ where: { userId: user.id } });
  await prisma.budget.deleteMany({ where: { userId: user.id } });
  await prisma.recurringRule.deleteMany({ where: { userId: user.id } });

  const rng = seededRandom(42);
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  type TxRow = {
    type: string; amount: number; currency: string; amountUSD: number;
    date: Date; description: string; categoryId: number; userId: number;
    isTaxDeductible: boolean;
  };
  const transactions: TxRow[] = [];

  // ===== INCOME PATTERNS =====
  // Realistic freelancer: ~$80K/year = ~$6,700/mo average
  // 1 steady retainer client ($3,000/mo), 1 project client (irregular), small gigs

  const retainerClient = { name: 'Greenfield Partners', base: 4000, catName: 'Client Payment' };
  // Project client pays 4 out of 6 months, variable amounts
  const projectClient = { name: 'Bolt Digital', catName: 'Consulting', amounts: [2800, 0, 2200, 3200, 1800, 2600] };
  // Small gigs - occasional
  const smallGigs = [
    { name: 'Logo redesign - local bakery', amount: 750, catName: 'Client Payment' },
    { name: 'WordPress fixes - Dr. Patel', amount: 400, catName: 'Client Payment' },
    { name: 'Landing page - FitTrack app', amount: 1200, catName: 'Client Payment' },
    { name: 'SEO audit - Bloom Florist', amount: 550, catName: 'Consulting' },
    { name: 'Email template - NovaTech', amount: 350, catName: 'Client Payment' },
    { name: 'Shopify setup - ThreadCraft', amount: 900, catName: 'Client Payment' },
  ];

  // ===== EXPENSE PATTERNS =====
  // Fixed monthly expenses a freelancer actually has
  const fixedMonthly = [
    { catName: 'Software', description: 'Adobe Creative Cloud', amount: 59.99, deductible: true },
    { catName: 'Software', description: 'Figma Pro', amount: 15, deductible: true },
    { catName: 'Software', description: 'GitHub Pro', amount: 4, deductible: true },
    { catName: 'Software', description: 'Google Workspace', amount: 12, deductible: true },
    { catName: 'Utilities', description: 'Internet - Spectrum', amount: 79.99, deductible: true },
    { catName: 'Utilities', description: 'Phone bill - T-Mobile', amount: 65, deductible: false },
    { catName: 'Utilities', description: 'Coworking membership - WeWork', amount: 299, deductible: true },
    { catName: 'Insurance', description: 'Health insurance premium', amount: 412, deductible: true },
  ];

  // Variable expenses with realistic ranges
  const variableExpenses = [
    { catName: 'Meals', descriptions: ['Coffee - Blue Bottle', 'Lunch at Chipotle', 'Starbucks', 'Pho lunch', 'Sandwich - deli', 'Smoothie King', 'Panera'], min: 5, max: 22, deductible: false, perMonth: [5, 10] },
    { catName: 'Meals', descriptions: ['Client lunch - Greenfield', 'Client dinner - Bolt Digital', 'Working lunch w/ contractor'], min: 35, max: 95, deductible: true, perMonth: [1, 3] },
    { catName: 'Travel', descriptions: ['Uber to client meeting', 'Lyft to WeWork', 'Gas - Costco', 'Parking downtown', 'Toll - bridge'], min: 6, max: 42, deductible: true, perMonth: [3, 6] },
    { catName: 'Office Supplies', descriptions: ['Pens & notebooks', 'Printer paper', 'Sticky notes', 'USB-C cable', 'Screen wipes'], min: 5, max: 28, deductible: true, perMonth: [0, 2] },
    { catName: 'Marketing', descriptions: ['Domain renewal', 'LinkedIn Premium', 'Google Ads campaign', 'Mailchimp'], min: 10, max: 65, deductible: true, perMonth: [0, 2] },
    { catName: 'Other Expense', descriptions: ['Parking meter', 'Shipping - client deliverable', 'Print shop - proofs', 'Amazon - office misc'], min: 8, max: 35, deductible: true, perMonth: [1, 3] },
  ];

  // Occasional bigger expenses (not every month)
  const occasionalExpenses = [
    { catName: 'Equipment', description: 'Logitech MX Keys keyboard', amount: 119, month: 1, deductible: true },
    { catName: 'Professional Services', description: 'Quarterly bookkeeping - H&R', amount: 225, month: 0, deductible: true },
    { catName: 'Professional Services', description: 'Quarterly bookkeeping - H&R', amount: 225, month: 3, deductible: true },
    { catName: 'Professional Services', description: 'Estimated tax payment - Q1', amount: 1850, month: 0, deductible: false },
    { catName: 'Professional Services', description: 'Estimated tax payment - Q2', amount: 1850, month: 3, deductible: false },
    { catName: 'Travel', description: 'Amtrak to Portland - client visit', amount: 89, month: 2, deductible: true },
    { catName: 'Travel', description: 'Hotel - Portland (1 night)', amount: 158, month: 2, deductible: true },
    { catName: 'Travel', description: 'Uber rides - Portland trip', amount: 47, month: 2, deductible: true },
    { catName: 'Equipment', description: 'Monitor stand - Jarvis', amount: 65, month: 4, deductible: true },
    { catName: 'Equipment', description: 'USB-C dock - CalDigit', amount: 189, month: 5, deductible: true },
    { catName: 'Marketing', description: 'Business cards - Moo 500ct', amount: 45, month: 0, deductible: true },
    { catName: 'Marketing', description: 'Portfolio site hosting (annual)', amount: 144, month: 2, deductible: true },
    { catName: 'Software', description: 'Tailwind UI license', amount: 299, month: 3, deductible: true },
    { catName: 'Insurance', description: 'Professional liability (annual)', amount: 540, month: 1, deductible: true },
    { catName: 'Other Expense', description: 'Conference ticket - local meetup', amount: 75, month: 4, deductible: true },
  ];

  for (let monthOffset = 5; monthOffset >= 0; monthOffset--) {
    const month = currentMonth - monthOffset;
    const year = month < 0 ? currentYear - 1 : currentYear;
    const adjMonth = month < 0 ? month + 12 : month;
    const monthIdx = 5 - monthOffset; // 0-5

    // --- INCOME ---

    // Retainer client: pays between 1st-8th, slight variation (+/- $200)
    const retainerAmount = retainerClient.base + Math.round((rng() - 0.5) * 400);
    const retainerCat = incomeCats.find(c => c.name === retainerClient.catName)!;
    transactions.push({
      type: 'income', amount: retainerAmount, currency: 'USD', amountUSD: retainerAmount,
      date: dateInMonth(year, adjMonth, 1 + Math.floor(rng() * 8)),
      description: `${retainerClient.name} - ${MONTHS[adjMonth]} retainer`,
      categoryId: retainerCat.id, userId: user.id, isTaxDeductible: false,
    });

    // Project client: pays some months, not others
    const projectAmount = projectClient.amounts[monthIdx];
    if (projectAmount > 0) {
      const projCat = incomeCats.find(c => c.name === projectClient.catName)!;
      // Projects pay later in the month (invoiced at end of work)
      transactions.push({
        type: 'income', amount: projectAmount, currency: 'USD', amountUSD: projectAmount,
        date: dateInMonth(year, adjMonth, 15 + Math.floor(rng() * 12)),
        description: `${projectClient.name} - project work`,
        categoryId: projCat.id, userId: user.id, isTaxDeductible: false,
      });
    }

    // Small gig: ~60% chance each month
    if (rng() > 0.4) {
      const gig = smallGigs[monthIdx % smallGigs.length];
      const gigCat = incomeCats.find(c => c.name === gig.catName)!;
      transactions.push({
        type: 'income', amount: gig.amount, currency: 'USD', amountUSD: gig.amount,
        date: dateInMonth(year, adjMonth, 10 + Math.floor(rng() * 15)),
        description: gig.name,
        categoryId: gigCat.id, userId: user.id, isTaxDeductible: false,
      });
    }

    // Royalties: small, only every other month
    if (monthIdx % 2 === 0) {
      const royaltyCat = incomeCats.find(c => c.name === 'Royalties')!;
      const royaltyAmount = randomBetween(rng, 45, 130);
      transactions.push({
        type: 'income', amount: royaltyAmount, currency: 'USD', amountUSD: royaltyAmount,
        date: dateInMonth(year, adjMonth, 25 + Math.floor(rng() * 4)),
        description: 'Udemy course royalties',
        categoryId: royaltyCat.id, userId: user.id, isTaxDeductible: false,
      });
    }

    // --- EXPENSES ---

    // Fixed monthly
    for (const fixed of fixedMonthly) {
      const cat = expenseCats.find(c => c.name === fixed.catName)!;
      // Fixed expenses land on consistent dates
      const day = fixed.description.includes('Health') ? 1 :
                  fixed.description.includes('Internet') ? 12 :
                  fixed.description.includes('Phone') ? 15 :
                  fixed.description.includes('Adobe') ? 5 : 8;
      transactions.push({
        type: 'expense', amount: fixed.amount, currency: 'USD', amountUSD: fixed.amount,
        date: dateInMonth(year, adjMonth, day),
        description: fixed.description,
        categoryId: cat.id, userId: user.id, isTaxDeductible: fixed.deductible,
      });
    }

    // Variable expenses
    for (const variable of variableExpenses) {
      const count = variable.perMonth[0] + Math.floor(rng() * (variable.perMonth[1] - variable.perMonth[0] + 1));
      const cat = expenseCats.find(c => c.name === variable.catName)!;
      for (let i = 0; i < count; i++) {
        const amount = randomBetween(rng, variable.min, variable.max);
        transactions.push({
          type: 'expense', amount, currency: 'USD', amountUSD: amount,
          date: dateInMonth(year, adjMonth, 1 + Math.floor(rng() * 28)),
          description: pickRandom(rng, variable.descriptions),
          categoryId: cat.id, userId: user.id, isTaxDeductible: variable.deductible,
        });
      }
    }

    // Occasional bigger expenses (only in their specific month)
    for (const occ of occasionalExpenses) {
      if (occ.month === monthIdx) {
        const cat = expenseCats.find(c => c.name === occ.catName)!;
        transactions.push({
          type: 'expense', amount: occ.amount, currency: 'USD', amountUSD: occ.amount,
          date: dateInMonth(year, adjMonth, 5 + Math.floor(rng() * 20)),
          description: occ.description,
          categoryId: cat.id, userId: user.id, isTaxDeductible: occ.deductible,
        });
      }
    }
  }

  await prisma.transaction.createMany({ data: transactions });

  const incomeTotal = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amountUSD, 0);
  const expenseTotal = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amountUSD, 0);
  const incomeCount = transactions.filter(t => t.type === 'income').length;
  const expenseCount = transactions.filter(t => t.type === 'expense').length;

  // Budgets - realistic for a freelancer watching their spending
  const softwareCat = expenseCats.find(c => c.name === 'Software')!;
  const mealsCat = expenseCats.find(c => c.name === 'Meals')!;
  const travelCat = expenseCats.find(c => c.name === 'Travel')!;
  const marketingCat = expenseCats.find(c => c.name === 'Marketing')!;

  await prisma.budget.createMany({
    data: [
      { name: 'Software & Tools', amount: 150, currency: 'USD', period: 'monthly', categoryId: softwareCat.id, userId: user.id, startDate: new Date(currentYear, 0, 1), isActive: true },
      { name: 'Client Meals', amount: 200, currency: 'USD', period: 'monthly', categoryId: mealsCat.id, userId: user.id, startDate: new Date(currentYear, 0, 1), isActive: true },
      { name: 'Travel', amount: 600, currency: 'USD', period: 'quarterly', categoryId: travelCat.id, userId: user.id, startDate: new Date(currentYear, 0, 1), isActive: true },
      { name: 'Marketing', amount: 100, currency: 'USD', period: 'monthly', categoryId: marketingCat.id, userId: user.id, startDate: new Date(currentYear, 0, 1), isActive: true },
    ],
  });

  // Recurring rules
  const insuranceCat = expenseCats.find(c => c.name === 'Insurance')!;
  const utilitiesCat = expenseCats.find(c => c.name === 'Utilities')!;
  const clientPaymentCat = incomeCats.find(c => c.name === 'Client Payment')!;
  const nextMonth = new Date(currentYear, currentMonth + 1, 1);

  await prisma.recurringRule.createMany({
    data: [
      { type: 'expense', amount: 412, currency: 'USD', description: 'Health insurance premium', categoryId: insuranceCat.id, frequency: 'monthly', dayOfMonth: 1, nextRunDate: nextMonth, isActive: true, userId: user.id },
      { type: 'expense', amount: 299, currency: 'USD', description: 'WeWork coworking membership', categoryId: utilitiesCat.id, frequency: 'monthly', dayOfMonth: 1, nextRunDate: nextMonth, isActive: true, userId: user.id },
      { type: 'expense', amount: 59.99, currency: 'USD', description: 'Adobe Creative Cloud', categoryId: softwareCat.id, frequency: 'monthly', dayOfMonth: 5, nextRunDate: new Date(currentYear, currentMonth + 1, 5), isActive: true, userId: user.id },
      { type: 'income', amount: 4000, currency: 'USD', description: 'Greenfield Partners retainer', categoryId: clientPaymentCat.id, frequency: 'monthly', dayOfMonth: 3, nextRunDate: new Date(currentYear, currentMonth + 1, 3), isActive: true, userId: user.id },
    ],
  });

  console.log(`\nSeed complete: demo@obolus.dev / password123`);
  console.log(`  ${transactions.length} transactions (${incomeCount} income, ${expenseCount} expenses)`);
  console.log(`  6-month income:  $${incomeTotal.toFixed(2)} (~$${(incomeTotal / 6).toFixed(0)}/mo, ~$${(incomeTotal * 2).toFixed(0)}/yr)`);
  console.log(`  6-month expenses: $${expenseTotal.toFixed(2)} (~$${(expenseTotal / 6).toFixed(0)}/mo)`);
  console.log(`  Net: $${(incomeTotal - expenseTotal).toFixed(2)}`);
  console.log(`  4 budgets, 4 recurring rules\n`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
