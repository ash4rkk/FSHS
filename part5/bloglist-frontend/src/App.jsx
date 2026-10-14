import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)
  const [loginVisible, setLoginVisible] = useState(null)

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const notify = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)

      setUser(user)
      setUsername('')
      setPassword('')
      notify('Logged in successfully')
    } catch {
      notify('wrong username or password', 'error')
    }
  }

  const handleLogOut = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const addBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(returnedBlog))
      notify('a new blog added')
      blogFormRef.current.toggleVisibility()
    } catch (error) {
      if (error.response && error.response.status === 401) {
        window.localStorage.removeItem('loggedBlogappUser')
        blogService.setToken(null)
        setUser(null)
        notify('session expired logged out', 'error')
      } else {
        notify('creating blog failed', 'error')
      }
    }
  }

  const likeBlog = async (id) => {
    const blog = blogs.find((b) => b.id === id)
    const updatedBlog = { ...blog, likes: blog.likes + 1 }

    try {
      const returnedBlog = await blogService.update(id, updatedBlog)
      setBlogs(blogs.map((b) => (b.id !== id ? b : returnedBlog)))
    } catch (error) {
      if (error.response && error.response.status === 401) {
        window.localStorage.removeItem('loggedBlogappUser')
        blogService.setToken(null)
        setUser(null)
        notify('session expired logged out', 'error')
      } else {
        notify('updating blog failed', 'error')
      }
    }
  }

  const userLogged = () => (
    <div>
      <p>{user.name} logged in</p>
      <button onClick={handleLogOut}>logout</button>
    </div>
  )

  const removeBlog = async (id) => {
    const blog = blogs.find((b) => b.id === id)

    if (!window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      return
    }

    try {
      await blogService.remove(id)
      setBlogs(blogs.filter((b) => b.id !== id))
      notify('Blog removed', 'success')
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log(error)
      } else {
        notify('deleting blog failed')
      }
    }
  }

  const loginForm = () => {
    const hideWhenVisible = { display: loginVisible ? 'none' : '' }
    const showWhenVisible = { display: loginVisible ? '' : 'none' }

    return (
      <div>
        <div style={hideWhenVisible}>
          <button onClick={() => setLoginVisible(true)}>log in</button>
        </div>
        <div style={showWhenVisible}>
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
          <button onClick={() => setLoginVisible(false)}>cancel</button>
        </div>
      </div>
    )
  }

  const blogFormRef = useRef()

  const blogForm = () => {
    return (
      <Togglable ref={blogFormRef} buttonLabel="show">
        <BlogForm createBlog={addBlog} />
      </Togglable>
    )
  }

  return (
    <div>
      <Notification
        message={notification ? notification.message : null}
        type={notification ? notification.type : null}
      />
      {!user && loginForm()}
      {user && (
        <div>
          <h2>blogs</h2>
          {userLogged()}
          {blogForm()}
          {blogs
            .sort((a, b) => b.likes - a.likes)
            .map((blog) => (
              <Blog
                key={blog.id}
                blog={blog}
                user={user}
                handleLike={() => likeBlog(blog.id)}
                handleRemove={() => removeBlog(blog.id)}
              />
            ))}
        </div>
      )}
    </div>
  )
}

export default App
