import { expect, test } from '@playwright/test';

// One smoke journey over the real static build: a recruiter lands, scans the
// projects, opens one, and finds how to get in touch.

test('home page: hero, projects, disclosure, contact', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Kelvin Wilch/);
  await expect(page.getByRole('heading', { level: 1 })).toContainText("Hi, I'm Kelvin.");

  // Four project cards, ClassPing open by default (review M1).
  const more = page.getByRole('button', { name: /^More about/ });
  await expect(more).toHaveCount(4);
  await expect(page.getByRole('button', { name: 'More about ClassPing' })).toHaveAttribute(
    'aria-expanded',
    'true',
  );

  const ro5n3r = page.getByRole('button', { name: 'More about Ro5n3R' });
  await expect(ro5n3r).toHaveAttribute('aria-expanded', 'false');
  await ro5n3r.click();
  await expect(ro5n3r).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByText("A lot of this site's style comes straight from it.")).toBeVisible();

  // Contact: the email is assembled in the browser, LinkedIn is linked.
  await expect(page.getByRole('link', { name: /@gmail\.com/ })).toHaveAttribute('href', /^mailto:/);
  await expect(page.getByRole('link', { name: 'LinkedIn' })).toHaveAttribute(
    'href',
    /linkedin\.com\/in\//,
  );
});

test('static HTML does not contain the email address', async ({ request }) => {
  const html = await (await request.get('/')).text();
  expect(html).not.toMatch(/kelvinmusiomi99@gmail\.com/);
});

test('mobile menu opens, navigates and closes', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'The menu button only exists below 768px');
  await page.goto('/');
  const menu = page.getByRole('button', { name: 'Open menu' });
  await menu.click();
  const sheetLink = page
    .getByRole('navigation', { name: 'Main' })
    .getByRole('link', { name: 'Academics' });
  await expect(sheetLink).toBeVisible();
  await sheetLink.click();
  await expect(page.getByRole('button', { name: 'Open menu' })).toHaveAttribute(
    'aria-expanded',
    'false',
  );
  await expect(page).toHaveURL(/#academics$/);
});

test('theme toggle switches to true black and remembers it', async ({ page, isMobile }) => {
  test.skip(isMobile, 'Desktop nav shows the toggle directly');
  await page.goto('/');
  await page.emulateMedia({ colorScheme: 'light' });
  await page.getByRole('button', { name: 'Switch to dark theme' }).click();
  const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  expect(bg).toBe('rgb(0, 0, 0)');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
});
