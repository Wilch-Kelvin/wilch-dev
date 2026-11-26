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

test('motion can be paused and the choice is remembered', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  const pause = page.getByRole('contentinfo').getByRole('button', { name: 'Pause motion' });
  await pause.click();
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'paused');
  const spinning = await page
    .locator('.spin')
    .first()
    .evaluate((el) => getComputedStyle(el).animationName);
  expect(spinning).toBe('none');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'paused');
});

test('reduced motion stops every animation', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const running = await page.evaluate(() => document.getAnimations().length);
  expect(running).toBe(0);
});

test('loading the page causes almost no layout shift (CLS < 0.1)', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1500);
  const cls = await page.evaluate(
    () =>
      new Promise<number>((resolve) => {
        let total = 0;
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries() as (PerformanceEntry & {
            value: number;
            hadRecentInput: boolean;
          })[]) {
            if (!entry.hadRecentInput) total += entry.value;
          }
        }).observe({ type: 'layout-shift', buffered: true });
        setTimeout(() => resolve(total), 200);
      }),
  );
  expect(cls).toBeLessThan(0.1);
});

test('the hero photo sits above its spinning frame and stays upright', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  const photo = page.getByRole('img', { name: /^Kelvin Wilch smiling/ });
  await expect(photo).toBeVisible();
  // Topmost thing at the centre of the frame is the photo, not the mat.
  const box = (await page.locator('[data-portrait]').boundingBox())!;
  const onTop = await page.evaluate(
    ({ x, y }) => document.elementFromPoint(x, y)?.closest('[data-portrait-face]') !== null,
    { x: box.x + box.width / 2, y: box.y + box.height / 2 },
  );
  expect(onTop).toBe(true);
  // The frame spins and the photo counter-spins at the same speed, so the
  // photo's net rotation stays ~0 even halfway through the loop.
  await page.evaluate(() => {
    for (const a of document.getAnimations())
      if ((a as CSSAnimation).animationName === 'spin') a.currentTime = 24_000;
  });
  const net = await photo.evaluate((img) => {
    const angle = (el: Element) => {
      const m = new DOMMatrix(
        getComputedStyle(el).rotate === 'none'
          ? undefined
          : `rotate(${getComputedStyle(el).rotate})`,
      );
      return Math.atan2(m.b, m.a) * (180 / Math.PI);
    };
    return angle(img) + angle(img.parentElement!);
  });
  expect(Math.abs(net) % 360).toBeLessThan(1);
});

test('if the photo cannot load, the K monogram takes its place', async ({ page }) => {
  await page.route('**/*.public.blob.vercel-storage.com/**', (route) => route.abort());
  await page.goto('/');
  await expect(page.locator('[data-portrait]').getByText('K', { exact: true })).toBeVisible();
  await expect(page.getByRole('img', { name: /^Kelvin Wilch smiling/ })).toHaveCount(0);
});

test('the nav underline slides to the section being read', async ({ page, isMobile }) => {
  test.skip(isMobile, 'The underline is part of the desktop nav');
  await page.goto('/#resume');
  const nav = page.getByRole('navigation', { name: 'Main' });
  const link = nav.getByRole('link', { name: 'Resume', exact: true });
  await expect(link).toHaveAttribute('aria-current', 'true');
  const bar = nav.locator('.nav-indicator');
  await expect(bar).toHaveCSS('opacity', '1');
  // Wait for the spring to settle, then the bar must sit under the link.
  await page.waitForTimeout(900);
  const [l, b] = [(await link.boundingBox())!, (await bar.boundingBox())!];
  expect(Math.abs(l.x + l.width / 2 - (b.x + b.width / 2))).toBeLessThan(2);
});

test('unknown pages get the friendly 404 with a way home', async ({ page }) => {
  const response = await page.goto('/this-does-not-exist/');
  expect(response?.status()).toBe(404);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Nothing here.');
  await page.getByRole('link', { name: 'Back to the home page' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toContainText("Hi, I'm Kelvin.");
});

test('metadata: title, description, OG image, sitemap and robots', async ({ page, request }) => {
  await page.goto('/');
  await expect(page).toHaveTitle('Kelvin Wilch | Computer Science and Cybersecurity student');
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /Kelvin Wilch/);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://wilch.dev/');
  const og = await page.locator('meta[property="og:image"]').getAttribute('content');
  const image = await request.get(new URL(og!).pathname);
  expect(image.headers()['content-type']).toBe('image/png');
  expect((await request.get('/sitemap.xml')).ok()).toBe(true);
  expect(await (await request.get('/robots.txt')).text()).toContain(
    'Sitemap: https://wilch.dev/sitemap.xml',
  );
});
