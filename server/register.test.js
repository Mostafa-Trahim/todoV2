import { insertTestUser } from './helpers/test.js';
import { expect } from 'chai';

const baseUrl = 'http://localhost:3001';


describe('POST Register', () => {
    const email = 'register@foo.com';
    const password = 'register123';

    it ("should register with valid email and password", async() => {
        const response = await fetch(baseUrl + '/user/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 'email': email, 'password': password })
        });
        const data = await response.json();

        expect(response.status).to.equal(201, data.error);
        expect(data).to.be.an('object');
        expect(data).to.include.all.keys('id', 'email');
    });
});

describe('POST Login', () => {
    const email = 'login@foo.com';
    const password = 'login123';
    insertTestUser(email, password);
    
    it ("should login with valid email and password", async() => {
        const response = await fetch(baseUrl + '/user/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 'email': email, 'password': password })
        });
        const data = await response.json();

        expect(response.status).to.equal(200, data.error);
        expect(data).to.be.an('object');
        expect(data).to.include.all.keys('id', 'email', 'token');
    });
});