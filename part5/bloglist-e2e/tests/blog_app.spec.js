const { test, expect, beforeEach, describe } = require('@playwright/test')
const { login, createBlog } = require('./utils')

test.describe('Blog app', () => {
  test.beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3001/api/testing/reset')
    await request.post('http://localhost:3001/api/users', {
      data: { username: 'ash4rkk', name: 'ash4rkk', password: 'test' },
    })
    await request.post('http://localhost:3001/api/users', {
      data: { username: 'other', name: 'other', password: 'test' },
    })
    await page.goto('http://localhost:5173')
  })

  test('Login form is show', async ({ page }) => {
    await page.getByRole('button', { name: 'log in' }).click()
    await expect(page.getByText('usernamepasswordlogin')).toBeVisible()
  })

  test.describe('Login', () => {
    test('succeds with correct credentials', async ({ page }) => {
      await page.getByRole('button', { name: 'log in' }).click()
      await page.getByRole('textbox').first().fill('ash4rkk')
      await page.getByRole('textbox').last().fill('test')
      await page.getByRole('button', { name: 'login' }).click()
      await expect(page.getByText('Logged in successfully')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByRole('button', { name: 'log in' }).click()
      await page.getByRole('textbox').first().fill('ash4rkk')
      await page.getByRole('textbox').last().fill('wrong')
      await page.getByRole('button', { name: 'login' }).click()
      await expect(page.getByText('wrong username or password')).toBeVisible()
    })
  })

  test.describe('When logged in', () => {
    test.beforeEach(async ({ page }) => {
      await login(page, 'ash4rkk', 'test')
    })

    test('a new blog can be created', async ({ page }) => {
      await page.getByRole('button', { name: 'create new blog' }).click()
      await page.getByRole('textbox', { name: 'title:' }).fill('sampleTitle')
      await page.getByRole('textbox', { name: 'author:' }).fill('sampleAuthor')
      await page
        .getByRole('textbox', { name: 'url:' })
        .fill('http://sampleurl.com')
      await page.getByRole('button', { name: 'create', exact: true }).click()
      await expect(page.getByText('a new blog added')).toBeVisible()
      await expect(page.getByText('sampleTitle sampleAuthor')).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
      await page.getByRole('button', { name: 'create new blog' }).click()
      await createBlog(
        page,
        'sampleTitle',
        'sampleAuthor',
        'http://sampleurl.com',
      )
      await page.getByRole('button', { name: 'view' }).first().click()
      await page.getByRole('button', { name: 'like' }).click()
      await expect(page.getByText('likes 1like')).toBeVisible()
    })

    test('a blog can be deleted', async ({ page }) => {
      await page.getByRole('button', { name: 'create new blog' }).click()
      await createBlog(
        page,
        'sampleTitle',
        'sampleAuthor',
        'http://sampleurl.com',
      )
      await page.getByRole('button', { name: 'view' }).first().click()
      page.on('dialog', (dialog) => dialog.accept())
      await page.getByRole('button', { name: 'remove' }).click()
      await expect(page.getByText('Blog removed')).toBeVisible()
      await expect(page.getByText('sampleTitle')).not.toBeVisible()
    })

    test('only the creator sees the remove button', async ({ page }) => {
      await page.getByRole('button', { name: 'create new blog' }).click()
      await createBlog(
        page,
        'sampleTitle',
        'sampleAuthor',
        'http://sampleurl.com',
      )
      await expect(page.getByText('sampleTitle sampleAuthor')).toBeVisible()

      await page.getByRole('button', { name: 'logout' }).click()
      await login(page, 'other', 'test')
      await expect(page.getByText('other logged in')).toBeVisible()

      await page.getByRole('button', { name: 'view' }).click()
      await expect(page.getByRole('button', { name: 'like' })).toBeVisible()
      await expect(page.getByRole('button', { name: 'remove' })).toHaveCount(0)
    })

    test('blogs are ordered by likes, most liked first', async ({ page }) => {
      await page.getByRole('button', { name: 'create new blog' }).click()
      await createBlog(page, 'first blog', 'author1', 'http://first.com')
      await expect(page.getByText('first blog author1')).toBeVisible()

      await page.getByRole('button', { name: 'create new blog' }).click()
      await createBlog(page, 'second blog', 'author2', 'http://second.com')
      await expect(page.getByText('second blog author2')).toBeVisible()

      const second = page.locator('.blog').filter({ hasText: 'second blog' })
      await second.getByRole('button', { name: 'view' }).click()
      await second.getByRole('button', { name: 'like' }).click()
      await expect(second.getByText('likes 1')).toBeVisible()
      await second.getByRole('button', { name: 'like' }).click()
      await expect(second.getByText('likes 2')).toBeVisible()

      await expect(page.locator('.blog').first()).toContainText('second blog')
      await expect(page.locator('.blog').last()).toContainText('first blog')
    })
  })
})
