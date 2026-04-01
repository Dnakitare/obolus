import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';
import path from 'path';

let prisma: PrismaClient;

export function getTestPrisma() {
  return prisma;
}

export async function setupTestDb() {
  const cwd = path.resolve(__dirname, '../..');

  execSync('npx prisma migrate deploy', {
    cwd,
    env: { ...process.env },
    stdio: 'pipe',
  });

  prisma = new PrismaClient();
  return prisma;
}

export async function teardownTestDb() {
  if (prisma) {
    await prisma.$disconnect();
  }
}

export async function cleanDb() {
  await prisma.transaction.deleteMany();
  await prisma.budget.deleteMany();
  await prisma.recurringRule.deleteMany();
  await prisma.category.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.user.deleteMany();
  await prisma.exchangeRate.deleteMany();
}
