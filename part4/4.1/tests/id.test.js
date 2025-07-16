const { test, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

test('blog posts have id property', async () => {
  const response = await api.get('/api/blogs')
  const blogs = response.body

  // Check that every blog has an 'id' property and not '_id'
  blogs.forEach(blog => {
    assert.ok(blog.id)                // has id
    assert.strictEqual(blog._id, undefined) // does NOT have _id
  })
})

after(async () => {
  await mongoose.connection.close()
})