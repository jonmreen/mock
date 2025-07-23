import { test, expect } from '@playwright/test';

test('Delete an item', async ({ page }) => {
  const uniqueTitle = `Item To Delete ${Date.now()}`;

  await page.goto('http://localhost:3000');
  await page.getByTestId('username-input').fill('admin');
  await page.getByTestId('password-input').fill('pass123');
  await page.getByTestId('login-button').click();

  await page.getByTestId('new-item-input').fill(uniqueTitle);
  await page.getByTestId('add-button').click();

  // Locate the item element with matching title
  const item = await page.locator('[data-testid^="item-title-"]', { hasText: uniqueTitle }).last();
  await expect(item).toBeVisible();

  // Get its numeric ID
  const testIdAttr = await item.getAttribute('data-testid'); // e.g., item-title-42
  const realId = testIdAttr?.split('-')[2];

  // Delete the item
  await page.getByTestId(`delete-button-${realId}`).click();

  // Ensure it is no longer present
  await expect(page.getByTestId(`item-title-${realId}`)).not.toBeVisible();
});
