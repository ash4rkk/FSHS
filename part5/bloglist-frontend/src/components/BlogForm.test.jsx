// Make a test for the new blog form. The test should check, that the form calls the event handler it received as props with the right details when a new blog is created.

import userEvent from '@testing-library/user-event'
import { expect, vi } from 'vitest'
import BlogForm from './BlogForm'
import { render, screen } from '@testing-library/react'

test('<BlogForm /> ', async () => {
  const createBlog = vi.fn()
  const user = userEvent.setup()

  render(<BlogForm createBlog={createBlog} />)

  await user.type(screen.getByLabelText('title:'), 'Testing forms')
  await user.type(screen.getByLabelText('author:'), 'A W')
  await user.type(screen.getByLabelText('url:'), 'http://example.com')
  await user.click(screen.getByText('create'))

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0]).toEqual({
    title: 'Testing forms',
    author: 'A W',
    url: 'http://example.com',
  })
})
