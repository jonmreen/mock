import { test, expect } from '@playwright/test';

test('Create a new item', async ({ page }) => {
  const uniqueTitle = `Playwright Task ${Date.now()}`;

  await page.goto('http://localhost:3000');
  await page.getByTestId('username-input').fill('admin');
  await page.getByTestId('password-input').fill('pass123');
  await page.getByTestId('login-button').click();

  await page.getByTestId('new-item-input').fill(uniqueTitle);
  await page.getByTestId('add-button').click();

  // Wait for and assert the specific newly added item
  const itemTitle = await page.locator('[data-testid^="item-title-"]', { hasText: uniqueTitle }).last();
  await expect(itemTitle).toBeVisible();
  await expect(itemTitle).toHaveText(uniqueTitle);
});
