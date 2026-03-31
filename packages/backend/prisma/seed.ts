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

async function main() {
  // Create demo user
  const passwordHash = await bcrypt.hash('password123', 12);
  const user = await prisma.user.upsert({
    where: { email: 'demo@obolus.dev' },
    update: {},
    create: {
      email: 'demo@obolus.dev',
      passwordHash,
      displayName: 'Demo User',
    },
  });

  // Create categories
  for (const cat of EXPENSE_CATEGORIES) {
    await prisma.category.upsert({
      where: { name_userId_type: { name: cat.name, userId: user.id, type: 'expense' } },
      update: {},
      create: { ...cat, type: 'expense', userId: user.id, isDefault: true },
    });
  }
  for (const cat of INCOME_CATEGORIES) {
    await prisma.category.upsert({
      where: { name_userId_type: { name: cat.name, userId: user.id, type: 'income' } },
      update: {},
      create: { ...cat, type: 'income', userId: user.id, isDefault: true },
    });
  }

  console.log('Seed complete: demo@obolus.dev / password123');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
