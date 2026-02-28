import { test, expect } from '@playwright/test'

test('mvp smoke', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveURL(/.*/)
})
