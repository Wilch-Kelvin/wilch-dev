import { expect, test } from '@playwright/test';

test('home page renders with the full name', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page).toHaveTitle(/Kelvin Wilch/);
});
