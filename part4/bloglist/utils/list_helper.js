const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  return blogs.reduce(
    (fav, blog) => (blog.likes > fav.likes ? blog : fav),
    blogs[0],
  )
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const counts = blogs.reduce((acc, blog) => {
    acc[blog.author] = (acc[blog.author] || 0) + 1
    return acc
  }, {})

  const topAuthor = Object.keys(counts).reduce((top, author) => {
    return counts[author] > counts[top] ? author : top
  })

  return { author: topAuthor, blogs: counts[topAuthor] }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const likesByAuthor = blogs.reduce((acc, blog) => {
    acc[blog.author] = (acc[blog.author] || 0) + blog.likes
    return acc
  }, {})

  const topAuthor = Object.keys(likesByAuthor).reduce((top, author) =>
    likesByAuthor[author] > likesByAuthor[top] ? author : top,
  )
  return { author: topAuthor, likes: likesByAuthor[topAuthor] }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}
