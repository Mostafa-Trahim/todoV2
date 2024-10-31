import { getToken, initializeTestDb, insertTestUser } from "./helpers/test.js";

import { expect } from "chai";

const baseUrl = 'http://localhost:3001';

describe('GET Tasks', () => {
    it ("should return all tasks", async() => {
        const response = await fetch(baseUrl);
        const data = await response.json();

        expect(response.status).to.equal(200);
        expect(data).to.be.an('array').that.is.not.empty;
        expect(data[0]).to.include.all.keys('id', 'description');
    });
});


describe('POST Task', () => {
    const email = 'post@foo.com';
    const password = 'post123';
    it("should create a new task", async () => {
        await insertTestUser(email, password);
        const token = await getToken(email);
        const response = await fetch(baseUrl + '/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify({ description: 'New Task' })
        });
        const data = await response.json();

        expect(response.status).to.equal(200);
        expect(data).to.be.an('object');
        expect(data).to.have.all.keys('id');
    });

    it("should not create a new task without description", async () => {
        const token = await getToken(email);
        const response = await fetch(baseUrl + '/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token 
            },
            body: JSON.stringify({ description: null })
        });
        const data = await response.json();

        expect(response.status).to.equal(500);
        expect(data).to.be.an('object');
        expect(data).to.have.all.keys('error');
    });
});


describe('DELETE Task', () => {
    it ("should delete a task", async() => {
        const response = await fetch(baseUrl + '/delete/1', {
            method: 'DELETE'
        });
        const data = await response.json();

        expect(response.status).to.equal(200);
        expect(data).to.be.an('object')
        expect(data).to.include.all.keys('id');
    });

    it ("should not delete a task with SQL Injection", async() => {
        const response = await fetch(baseUrl + '/delete/id=0 or id > 0', {
            method: 'DELETE'
        });
        const data = await response.json();

        expect(response.status).to.equal(500);
        expect(data).to.be.an('object');
        expect(data).to.have.all.keys('error');
    });
});

