// This runs before any test file is imported
process.env.DATABASE_URL = 'file:./test.db';
process.env.JWT_ACCESS_SECRET = 'test-access-secret-that-is-at-least-32-chars';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret-that-is-at-least-32-chars';
process.env.CORS_ORIGIN = 'http://localhost:5173';
process.env.NODE_ENV = 'test';
process.env.UPLOAD_DIR = '/tmp/obolus-test-uploads';
