import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../src/app';
import { setupTestDb, teardownTestDb, cleanDb, getTestPrisma } from '../helpers/setup';

let token: string;
let expenseCategoryId: number;
let incomeCategoryId: number;

async function registerAndLogin() {
  const res = await request(app)
    .post('/api/v1/auth/register')
    .send({ email: 'tx@test.com', password: 'password123', displayName: 'TX User' });
  token = res.body.accessToken;

  const prisma = getTestPrisma();
  const expCat = await prisma.category.findFirst({
    where: { userId: res.body.user.id, type: 'expense' },
  });
  const incCat = await prisma.category.findFirst({
    where: { userId: res.body.user.id, type: 'income' },
  });
  expenseCategoryId = expCat!.id;
  incomeCategoryId = incCat!.id;
}

describe('Transaction API', () => {
  beforeAll(async () => {
    await setupTestDb();
  });

  afterAll(async () => {
    await teardownTestDb();
  });

  beforeEach(async () => {
    await cleanDb();
    await registerAndLogin();
  });

  describe('POST /api/v1/transactions', () => {
    it('creates a transaction', async () => {
      const res = await request(app)
        .post('/api/v1/transactions')
        .set('Authorization', `Bearer ${token}`)
        .send({
          type: 'expense',
          amount: 42.50,
          currency: 'USD',
          date: '2026-03-15T00:00:00.000Z',
          description: 'Test expense',
          categoryId: expenseCategoryId,
        });

      expect(res.status).toBe(201);
      expect(res.body.data.amount).toBe(42.50);
      expect(res.body.data.description).toBe('Test expense');
      expect(res.body.data.category).toBeDefined();
    });

    it('rejects missing required fields', async () => {
      const res = await request(app)
        .post('/api/v1/transactions')
        .set('Authorization', `Bearer ${token}`)
        .send({ type: 'expense' });

      expect(res.status).toBe(400);
    });

    it('rejects negative amount', async () => {
      const res = await request(app)
        .post('/api/v1/transactions')
        .set('Authorization', `Bearer ${token}`)
        .send({
          type: 'expense',
          amount: -10,
          currency: 'USD',
          date: '2026-03-15T00:00:00.000Z',
          description: 'Negative',
          categoryId: expenseCategoryId,
        });

      expect(res.status).toBe(400);
    });

    it('rejects unauthenticated request', async () => {
      const res = await request(app)
        .post('/api/v1/transactions')
        .send({ type: 'expense', amount: 10, date: '2026-03-15T00:00:00.000Z', description: 'No auth', categoryId: 1 });

      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/v1/transactions', () => {
    beforeEach(async () => {
      // Create a few transactions
      for (let i = 0; i < 5; i++) {
        await request(app)
          .post('/api/v1/transactions')
          .set('Authorization', `Bearer ${token}`)
          .send({
            type: i < 3 ? 'expense' : 'income',
            amount: (i + 1) * 100,
            currency: 'USD',
            date: `2026-03-${10 + i}T00:00:00.000Z`,
            description: `Transaction ${i}`,
            categoryId: i < 3 ? expenseCategoryId : incomeCategoryId,
          });
      }
    });

    it('returns paginated transactions', async () => {
      const res = await request(app)
        .get('/api/v1/transactions')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(5);
      expect(res.body.meta.total).toBe(5);
      expect(res.body.meta.totalPages).toBe(1);
    });

    it('filters by type', async () => {
      const res = await request(app)
        .get('/api/v1/transactions?type=expense')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(3);
      expect(res.body.data.every((t: { type: string }) => t.type === 'expense')).toBe(true);
    });

    it('paginates correctly', async () => {
      const res = await request(app)
        .get('/api/v1/transactions?page=1&limit=2')
        .set('Authorization', `Bearer ${token}`);

      expect(res.body.data.length).toBe(2);
      expect(res.body.meta.totalPages).toBe(3);
    });

    it('searches by description', async () => {
      const res = await request(app)
        .get('/api/v1/transactions?search=Transaction 0')
        .set('Authorization', `Bearer ${token}`);

      expect(res.body.data.length).toBe(1);
    });
  });

  describe('DELETE /api/v1/transactions/:id', () => {
    it('deletes a transaction', async () => {
      const create = await request(app)
        .post('/api/v1/transactions')
        .set('Authorization', `Bearer ${token}`)
        .send({
          type: 'expense',
          amount: 50,
          currency: 'USD',
          date: '2026-03-15T00:00:00.000Z',
          description: 'To delete',
          categoryId: expenseCategoryId,
        });

      const res = await request(app)
        .delete(`/api/v1/transactions/${create.body.data.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(204);

      const get = await request(app)
        .get(`/api/v1/transactions/${create.body.data.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(get.status).toBe(404);
    });
  });
});
