import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import Blog from './Blog'
import { test, expect, describe, beforeEach, vi } from 'vitest'
import userEvent from '@testing-library/user-event'

describe('<Blog />', () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'A W',
    url: 'http://exaple.com',
    likes: 7,
  }

  let mockHandleLike

  beforeEach(() => {
    mockHandleLike = vi.fn()
    render(<Blog blog={blog} handleLike={mockHandleLike} />)
  })
  test('renders content: title and author, but not url or likes by default', () => {
    const titleAuthorElement = screen.getByText(
      'Component testing is done with react-testing-library A W',
      { exact: false },
    )
    expect(titleAuthorElement).toBeDefined()

    const urlElement = screen.queryByText(blog.url)
    expect(urlElement).toBeNull()

    const likesElement = screen.queryByText('likes', { exact: false })
    expect(likesElement).toBeNull()
  })
  // Make a test, which checks that the blog's URL and number of likes are
  // shown when the button controlling the shown details has been clicked.
  test('blogs url and number of likes are shown when button controlling visibility is clicked', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const urlElement = screen.getByText(blog.url)
    expect(urlElement).toBeVisible()

    const likesElement = screen.getByText('likes', { exact: false })
    expect(likesElement).toBeVisible()
  })
  // Make a test, which ensures that if the like button is clicked twice,
  // the event handler the component received as props is called twice.
  test('if the like button is clicked twice, the handler is called twice', async () => {
    const user = userEvent.setup()
    await user.click(screen.getByText('view'))

    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockHandleLike.mock.calls).toHaveLength(2)
  })
})
