const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlog = [
  {
    title: 'Sample Blog Title',
    author: 'Sample Blog Author',
    url: 'http://example.com/sample-1',
    likes: '420',
  },
  {
    title: 'Sample Blog Title 2',
    author: 'Sample Blog Author 2',
    url: 'http://example.com/sample-2',
    likes: '420',
  },
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map((blog) => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map((u) => u.toJSON())
}

module.exports = { initialBlog, blogsInDb, usersInDb }
