import { test, expect } from '@playwright/test'

test.describe('mvp smoke', () => {
  test('dashboard page loads', async ({ page }) => {
    await page.goto('/dashboard')
    await expect(page.locator('h1')).toContainText('Dashboard')
  })

  test('projects page loads', async ({ page }) => {
    await page.goto('/projects')
    await expect(page.locator('h1')).toContainText('Projects')
  })

  test('tasks page loads', async ({ page }) => {
    await page.goto('/tasks')
    await expect(page.locator('h1')).toContainText('Tasks')
  })

  test('reports page loads', async ({ page }) => {
    await page.goto('/reports')
    await expect(page.locator('h1')).toContainText('Daily Reports')
  })
})
