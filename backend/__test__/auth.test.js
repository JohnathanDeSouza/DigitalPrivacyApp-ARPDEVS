const request = require('supertest');
const app = require('../server'); // Import the Express app
const { usersStore } = require('../routes/auth'); // Import the in-memory user store

// Clear the in-memory store before each test to ensure a clean slate
beforeEach(() => {
  usersStore.length = 0;
});

describe('Auth API', () => {
  
  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123'
        });
      
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('message', 'User registered successfully.');
      expect(res.body).toHaveProperty('access_token');
      expect(res.body.user.username).toBe('testuser');
    });

    it('should return 409 if the username is already taken', async () => {
      // First, register a user
      await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123'
        });

      // Then, try to register with the same username
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          email: 'another@example.com',
          password: 'password123'
        });

      expect(res.statusCode).toEqual(409);
      expect(res.body).toHaveProperty('error', 'User already exists.');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Register a user before each login test
      await request(app)
        .post('/api/auth/register')
        .send({
          username: 'loginuser',
          email: 'login@example.com',
          password: 'password123'
        });
    });

    it('should log in an existing user successfully', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          identifier: 'loginuser',
          password: 'password123'
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message', 'Login successful.');
      expect(res.body).toHaveProperty('access_token');
    });

    it('should return 401 for incorrect password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          identifier: 'loginuser',
          password: 'wrongpassword'
        });

      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('error', 'Authentication failed.');
    });
  });

});