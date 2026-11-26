// Screenshots of the built site at 390 / 768 / 1440 in light and dark.
// Usage: npm run build && node scripts/screenshots.mjs [outDir] [--viewport-only]
import { chromium } from '@playwright/test';
import { spawn } from 'node:child_process';
import { mkdir } from 'node:fs/promises';

const outDir = process.argv[2] ?? 'screenshots';
const fullPage = !process.argv.includes('--viewport-only');
const widths = [390, 768, 1440];
const themes = ['light', 'dark'];

const server = spawn('npx', ['next', 'start', '-H', '127.0.0.1', '-p', '4174'], {
  stdio: 'ignore',
});
await new Promise((r) => setTimeout(r, 2500));
await mkdir(outDir, { recursive: true });
const browser = await chromium.launch();
try {
  for (const theme of themes) {
    for (const width of widths) {
      const page = await browser.newPage({
        viewport: { width, height: width < 700 ? 844 : 900 },
        colorScheme: theme,
        reducedMotion: 'reduce',
      });
      await page.goto('http://127.0.0.1:4174/');
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(300);
      await page.screenshot({ path: `${outDir}/${width}-${theme}.png`, fullPage });
      await page.close();
    }
  }
} finally {
  await browser.close();
  server.kill();
}
console.log(`Saved to ${outDir}/`);
