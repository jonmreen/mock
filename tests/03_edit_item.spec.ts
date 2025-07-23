import { test, expect } from '@playwright/test';

test('Edit an existing item', async ({ page }) => {
  const originalTitle = `Editable Item ${Date.now()}`;
  const editedTitle = `Item Edited ${Date.now()}`;

  await page.goto('http://localhost:3000');
  await page.getByTestId('username-input').fill('admin');
  await page.getByTestId('password-input').fill('pass123');
  await page.getByTestId('login-button').click();

  await page.getByTestId('new-item-input').fill(originalTitle);
  await page.getByTestId('add-button').click();

  const list = page.getByTestId('items-list').locator('li');
  const item = list.last();

  await expect(item.getByTestId(/item-title-/)).toHaveText(originalTitle);

  const testIdAttr = await item.getAttribute('data-testid'); // e.g. item-21
  const realId = testIdAttr?.split('-')[1];

  await item.getByTestId(`edit-button-${realId}`).click();
  await item.getByTestId(`edit-input-${realId}`).fill(editedTitle);
  await item.getByTestId(`save-button-${realId}`).click();

  await expect(item.getByTestId(`item-title-${realId}`)).toHaveText(editedTitle);
});
