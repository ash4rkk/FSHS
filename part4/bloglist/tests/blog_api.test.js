const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const bcrypt = require('bcrypt')
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('../tests/test_helpers')
const api = supertest(app)
const assert = require('node:assert')

let token

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('samplePassword', 10)
  const testUser = new User({ username: 'sampleUser', passwordHash })
  await testUser.save()

  const loginResponse = await api
    .post('/api/login')
    .send({ username: 'sampleUser', password: 'samplePassword' })
    .expect(200)
  token = loginResponse.body.token
  const blogsWithUser = helper.initialBlog.map((blog) => ({
    ...blog,
    user: testUser._id,
  }))
  await Blog.insertMany(blogsWithUser)
})

test('blogs are returned as json', async () => {
  console.log('entered test')
  const response = await api.get('/api/blogs')
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.length, helper.initialBlog.length)
})

test('blogs have proper named id as id', async () => {
  const response = await api.get('/api/blogs')

  response.body.forEach((blog) => {
    assert.ok(blog.id)
    assert.strictEqual(blog._id, undefined)
  })
})

test('blogs post created successfully', async () => {
  const newBlog = {
    title: 'Sample Title',
    author: 'Sample Author',
    likes: 5,
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlog.length + 1)
})

test('blog creation fails with 401 if token is missing', async () => {
  const newBlog = {
    title: 'MissingTokenTitle',
    author: 'MissingTokenAuthor',
    likes: 2,
  }

  await api.post('/api/blogs').send(newBlog).expect(401)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlog.length)
})

test('blogs if likes count is missing then likes = 0', async () => {
  const newBlog = {
    title: 'Sample Title',
    author: 'Sample Author',
  }
  const response = await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.likes, 0)
})

test('blogs without title is not added', async () => {
  const newBlog = {
    author: 'Sample Author',
    likes: 3,
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(400)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlog.length)
})

test('blogs without author is not added', async () => {
  const newBlog = {
    title: 'Sample Title',
    likes: 3,
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(400)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlog.length)
})

test('blogs deletes successfuly', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(204)

  const blogsAtEnd = await helper.blogsInDb()

  assert.strictEqual(blogsAtEnd.length, helper.initialBlog.length - 1)
})

test('blogs likes updates', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToUpdate = blogsAtStart[0]

  const updatedData = {
    ...blogToUpdate,
    likes: blogToUpdate.likes + 1,
  }

  const response = await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(updatedData)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.likes, blogToUpdate.likes + 1)
})

after(async () => {
  await mongoose.connection.close()
})
