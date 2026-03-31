import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { prisma } from '../lib/prisma';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../lib/jwt';
import { AppError } from '../middleware/errorHandler';
import type { RegisterInput, LoginInput, UpdateProfileInput, ChangePasswordInput } from '../schemas/auth.schema';

const DEFAULT_EXPENSE_CATEGORIES = [
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

const DEFAULT_INCOME_CATEGORIES = [
  { name: 'Client Payment', icon: '💰', color: '#10B981' },
  { name: 'Consulting', icon: '🎯', color: '#3B82F6' },
  { name: 'Royalties', icon: '👑', color: '#8B5CF6' },
  { name: 'Product Sales', icon: '🛒', color: '#F59E0B' },
  { name: 'Other Income', icon: '💵', color: '#6B7280' },
];

async function seedDefaultCategories(userId: number) {
  const categories = [
    ...DEFAULT_EXPENSE_CATEGORIES.map(c => ({ ...c, type: 'expense', userId, isDefault: true })),
    ...DEFAULT_INCOME_CATEGORIES.map(c => ({ ...c, type: 'income', userId, isDefault: true })),
  ];
  await prisma.category.createMany({ data: categories });
}

async function generateTokens(userId: number, email: string) {
  const refreshTokenRecord = await prisma.refreshToken.create({
    data: {
      token: crypto.randomBytes(40).toString('hex'),
      userId,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    },
  });

  const accessToken = signAccessToken({ userId, email });
  const refreshToken = signRefreshToken({ userId, tokenId: refreshTokenRecord.id });

  return { accessToken, refreshToken };
}

export async function register(input: RegisterInput) {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) {
    throw new AppError(409, 'Email already registered');
  }

  const passwordHash = await bcrypt.hash(input.password, 12);
  const user = await prisma.user.create({
    data: {
      email: input.email,
      passwordHash,
      displayName: input.displayName,
    },
    select: { id: true, email: true, displayName: true, defaultCurrency: true, createdAt: true },
  });

  await seedDefaultCategories(user.id);
  const tokens = await generateTokens(user.id, user.email);

  return { user, ...tokens };
}

export async function login(input: LoginInput) {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  if (!user) {
    throw new AppError(401, 'Invalid email or password');
  }

  const valid = await bcrypt.compare(input.password, user.passwordHash);
  if (!valid) {
    throw new AppError(401, 'Invalid email or password');
  }

  const tokens = await generateTokens(user.id, user.email);

  return {
    user: {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      defaultCurrency: user.defaultCurrency,
      createdAt: user.createdAt,
    },
    ...tokens,
  };
}

export async function refresh(refreshTokenJwt: string) {
  let payload;
  try {
    payload = verifyRefreshToken(refreshTokenJwt);
  } catch {
    throw new AppError(401, 'Invalid refresh token');
  }

  const storedToken = await prisma.refreshToken.findFirst({
    where: { id: payload.tokenId, userId: payload.userId },
    include: { user: true },
  });

  if (!storedToken || storedToken.expiresAt < new Date()) {
    if (storedToken) {
      // Token reuse or expired — revoke all tokens for this user
      await prisma.refreshToken.deleteMany({ where: { userId: payload.userId } });
    }
    throw new AppError(401, 'Refresh token expired or revoked');
  }

  // Rotation: delete the used token
  await prisma.refreshToken.delete({ where: { id: storedToken.id } });

  const tokens = await generateTokens(storedToken.user.id, storedToken.user.email);
  return {
    user: {
      id: storedToken.user.id,
      email: storedToken.user.email,
      displayName: storedToken.user.displayName,
      defaultCurrency: storedToken.user.defaultCurrency,
    },
    ...tokens,
  };
}

export async function logout(userId: number, refreshTokenJwt: string) {
  try {
    const payload = verifyRefreshToken(refreshTokenJwt);
    await prisma.refreshToken.deleteMany({
      where: { id: payload.tokenId, userId },
    });
  } catch {
    // Token invalid, nothing to revoke
  }
}

export async function getMe(userId: number) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, displayName: true, defaultCurrency: true, createdAt: true },
  });
  if (!user) throw new AppError(404, 'User not found');
  return user;
}

export async function updateProfile(userId: number, input: UpdateProfileInput) {
  const user = await prisma.user.update({
    where: { id: userId },
    data: input,
    select: { id: true, email: true, displayName: true, defaultCurrency: true, createdAt: true },
  });
  return user;
}

export async function changePassword(userId: number, input: ChangePasswordInput) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AppError(404, 'User not found');

  const valid = await bcrypt.compare(input.currentPassword, user.passwordHash);
  if (!valid) throw new AppError(401, 'Current password is incorrect');

  const passwordHash = await bcrypt.hash(input.newPassword, 12);
  await prisma.user.update({ where: { id: userId }, data: { passwordHash } });
}
