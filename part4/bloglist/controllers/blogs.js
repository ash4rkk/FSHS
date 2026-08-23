const blogsRouters = require('express').Router()
const Blog = require('../models/blog')
const middleware = require('../utils/middleware')

blogsRouters.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouters.post('/', middleware.userExtractor, async (request, response) => {
  const body = request.body
  const user = request.user

  if (!user) {
    return response.status(400).send({ error: 'userId missing or not valid' })
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    likes: body.likes,
    user: user._id,
  })
  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})

blogsRouters.delete(
  '/:id',
  middleware.userExtractor,
  async (request, response) => {
    const blog = await Blog.findById(request.params.id)
    const user = request.user

    if (!blog) {
      return response.status(404).end()
    }

    if (!user) {
      return response.status(400).send({ error: 'userId missing or not valid' })
    }

    if (blog.user.toString() !== user._id.toString()) {
      return response
        .status(401)
        .send({ error: 'blog can be deleted by the user who added it' })
    }

    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
  },
)

blogsRouters.put('/:id', async (request, response) => {
  const { title, author, url, likes } = request.body

  const blog = await Blog.findByIdAndUpdate(
    request.params.id,
    { title, author, url, likes },
    { new: true, runValidators: true, context: 'query' },
  )

  if (!blog) {
    return response.status(404).end()
  }
  response.json(blog)
})

module.exports = blogsRouters
