const request = require('supertest');
const app = require('../server');

describe('Authentication Tests', () => {
    it('should register a new user', async () => {
        const res = await request(app).post('/api/auth/register').send({
            username: 'testuser',
            email: 'test@example.com',
            password: 'Password123!',
        });
        expect(res.statusCode).toBe(201);
    });

    it('should log in an existing user', async () => {
        const res = await request(app).post('/api/auth/login').send({
            username: 'testuser',
            password: 'Password123!',
        });
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('token');
    });
});
