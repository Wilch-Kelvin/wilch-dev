import { AA_LARGE_OR_UI, AA_TEXT, textContrast } from '@/lib/contrast';
import { colors, type Palette } from './colors';
import { focusBackgrounds, pairs } from './contrast-pairs';

// `npm run contrast` runs this file with a printed report. It is also part of
// `npm test`, so a colour change that breaks AA fails the build.

const themes = Object.entries(colors) as [keyof typeof colors, Palette][];

describe.each(themes)('%s theme: WCAG AA', (theme, palette) => {
  const rows = pairs.map((pair) => {
    const ratio = textContrast(palette[pair.fg], ...pair.bg.map((t) => palette[t]));
    const need = pair.kind === 'text' ? AA_TEXT : AA_LARGE_OR_UI;
    return { ...pair, ratio, need };
  });

  afterAll(() => {
    if (!process.env.CONTRAST_REPORT) return;
    const lines = rows.map(
      (r) =>
        `${r.ratio >= r.need ? 'PASS' : 'FAIL'}  ${r.ratio.toFixed(2).padStart(5)}:1 (≥${r.need})  ${r.where}`,
    );
    console.log(`\n${theme.toUpperCase()}\n${lines.join('\n')}`);
  });

  it.each(rows)('$where', ({ ratio, need }) => {
    expect(ratio).toBeGreaterThanOrEqual(need);
  });

  it.each(focusBackgrounds)('focus ring is visible on %s', (bg) => {
    const outer = textContrast(palette['focus-a'], palette[bg]);
    const inner = textContrast(palette['focus-b'], palette[bg]);
    expect(Math.max(outer, inner)).toBeGreaterThanOrEqual(AA_LARGE_OR_UI);
  });

  it('dark canvas is true black', () => {
    if (theme === 'dark') expect(palette.surface).toBe('#000000');
  });
});
