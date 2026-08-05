const express = require('express')
const mongoose = require('mongoose')
const config = require('./utils/config')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')
const blogRouter = require('./controllers/blogs')

const app = express()

logger.info(`Connecting to ${config.MONGODB_URL}`)

mongoose
  .connect(config.MONGODB_URL, { family: 4 })
  .then(() => {
    logger.info('Connected to MongoDb')
  })
  .catch((error) => {
    logger.error(`Connection to MongoDB error ${error.message}`)
  })

// app.use(express.static('dist'))
app.use(express.json())
app.use(middleware.requestLogger)
app.use('/api/blogs', blogsRouter)
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
