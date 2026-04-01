import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../src/app';
import { setupTestDb, teardownTestDb, cleanDb, getTestPrisma } from '../helpers/setup';

describe('Auth API', () => {
  beforeAll(async () => {
    await setupTestDb();
  });

  afterAll(async () => {
    await teardownTestDb();
  });

  beforeEach(async () => {
    await cleanDb();
  });

  describe('POST /api/v1/auth/register', () => {
    it('creates a new user and returns tokens', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({ email: 'new@test.com', password: 'password123', displayName: 'New User' });

      expect(res.status).toBe(201);
      expect(res.body.user.email).toBe('new@test.com');
      expect(res.body.user.displayName).toBe('New User');
      expect(res.body.accessToken).toBeDefined();
      expect(res.body.refreshToken).toBeDefined();
      expect(res.body.user.passwordHash).toBeUndefined();
    });

    it('seeds default categories on registration', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({ email: 'cat@test.com', password: 'password123', displayName: 'Cat User' });

      const prisma = getTestPrisma();
      const categories = await prisma.category.findMany({ where: { userId: res.body.user.id } });
      expect(categories.length).toBeGreaterThan(10);
      expect(categories.some(c => c.type === 'income')).toBe(true);
      expect(categories.some(c => c.type === 'expense')).toBe(true);
    });

    it('rejects duplicate email', async () => {
      await request(app)
        .post('/api/v1/auth/register')
        .send({ email: 'dup@test.com', password: 'password123', displayName: 'First' });

      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({ email: 'dup@test.com', password: 'password123', displayName: 'Second' });

      expect(res.status).toBe(409);
    });

    it('rejects short password', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({ email: 'short@test.com', password: '123', displayName: 'Short' });

      expect(res.status).toBe(400);
    });

    it('rejects invalid email', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({ email: 'not-an-email', password: 'password123', displayName: 'Bad' });

      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/v1/auth/login', () => {
    beforeEach(async () => {
      await request(app)
        .post('/api/v1/auth/register')
        .send({ email: 'login@test.com', password: 'password123', displayName: 'Login User' });
    });

    it('returns tokens on valid credentials', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'login@test.com', password: 'password123' });

      expect(res.status).toBe(200);
      expect(res.body.accessToken).toBeDefined();
      expect(res.body.refreshToken).toBeDefined();
      expect(res.body.user.email).toBe('login@test.com');
    });

    it('rejects wrong password', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'login@test.com', password: 'wrongpassword' });

      expect(res.status).toBe(401);
    });

    it('rejects non-existent email', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ email: 'nobody@test.com', password: 'password123' });

      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/v1/auth/refresh', () => {
    it('rotates tokens', async () => {
      const reg = await request(app)
        .post('/api/v1/auth/register')
        .send({ email: 'refresh@test.com', password: 'password123', displayName: 'Refresh' });

      const res = await request(app)
        .post('/api/v1/auth/refresh')
        .send({ refreshToken: reg.body.refreshToken });

      expect(res.status).toBe(200);
      expect(res.body.accessToken).toBeDefined();
      expect(res.body.refreshToken).toBeDefined();
      expect(res.body.refreshToken).not.toBe(reg.body.refreshToken);
    });

    it('rejects reused refresh token', async () => {
      const reg = await request(app)
        .post('/api/v1/auth/register')
        .send({ email: 'reuse@test.com', password: 'password123', displayName: 'Reuse' });

      // Use the token once
      await request(app)
        .post('/api/v1/auth/refresh')
        .send({ refreshToken: reg.body.refreshToken });

      // Try to use the same token again
      const res = await request(app)
        .post('/api/v1/auth/refresh')
        .send({ refreshToken: reg.body.refreshToken });

      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/v1/auth/me', () => {
    it('returns user profile with valid token', async () => {
      const reg = await request(app)
        .post('/api/v1/auth/register')
        .send({ email: 'me@test.com', password: 'password123', displayName: 'Me User' });

      const res = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${reg.body.accessToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.email).toBe('me@test.com');
    });

    it('rejects request without token', async () => {
      const res = await request(app).get('/api/v1/auth/me');
      expect(res.status).toBe(401);
    });
  });
});
