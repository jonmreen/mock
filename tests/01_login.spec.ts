import { test, expect } from '@playwright/test';

test('Login with valid credentials', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.getByTestId('username-input').fill('admin');
  await page.getByTestId('password-input').fill('pass123');
  await page.getByTestId('login-button').click();

  await expect(page.getByTestId('items-title')).toBeVisible();
});

test('Login with invalid credentials', async ({ page }) => {
  await page.goto('http://localhost:3000');
  await page.getByTestId('username-input').fill('admin');
  await page.getByTestId('password-input').fill('wrongpass');
  await page.getByTestId('login-button').click();

  await expect(page.locator('text=Login failed')).toBeVisible();
});
