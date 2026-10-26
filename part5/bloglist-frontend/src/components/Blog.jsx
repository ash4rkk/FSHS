import { useState } from 'react'

const Blog = ({ blog, user, handleLike, handleRemove }) => {
  const [blogVisible, setBlogVisible] = useState(false)
  const showRemoveButton =
    blog.user && user && blog.user.username === user.username
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }
  return (
    <div style={blogStyle} className="blog">
      <p>
        {blog.title} {blog.author}
        <button onClick={() => setBlogVisible(!blogVisible)}>view</button>
      </p>
      {blogVisible && (
        <div>
          <p>{blog.url}</p>
          <p>
            likes {blog.likes}
            <button onClick={handleLike}>like</button>
          </p>
          {showRemoveButton && (
            <button onClick={handleRemove} style={{ backgroundColor: 'cyan' }}>
              remove
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default Blog
