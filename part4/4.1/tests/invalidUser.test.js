const { test, after } = require('node:test');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);

test('invalid users are not saved', async () => {
  const invalidUser = {
    username: "mi",    // less than 3 chars for testing!
    name: "12",
    password: "pw",    // less than 3 chars for testing!
    blogs: []
  }

  await api
    .post('/api/users')
    .send(invalidUser)
    .expect(400)                   // check that bad request is returned
    .expect('Content-Type', /json/)

  // Optionally, query the users and check count:
  // const usersAtEnd = await helper.usersInDb()
  // expect(usersAtEnd).toHaveLength(usersAtStart.length)
})

after(async () => {
  await mongoose.connection.close()
})