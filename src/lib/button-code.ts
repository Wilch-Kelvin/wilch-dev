import type { CodeLine, CodeToken } from '@/content/schema';
import type { ColorToken, Palette } from '@/theme/colors';

// The "Build an expressive button" demo: turns the visitor's choices into the
// preview style and a highlighted, copy-pasteable code snippet. Pure, so it
// is tested without a browser.

export type FillId = 'primary' | 'tertiary' | 'secondary' | 'inverse';

export const fills: readonly { id: FillId; name: string; bg: ColorToken; fg: ColorToken }[] = [
  { id: 'primary', name: 'Primary', bg: 'primary', fg: 'on-primary' },
  { id: 'tertiary', name: 'Lime', bg: 'tertiary-c', fg: 'on-tertiary-c' },
  { id: 'secondary', name: 'Peach', bg: 'secondary-c', fg: 'on-secondary-c' },
  { id: 'inverse', name: 'Ink', bg: 'inverse', fg: 'on-inverse' },
];

export const RADIUS_MIN = 0;
export const RADIUS_MAX = 40;

export type ButtonChoice = { label: string; radius: number; fill: FillId };

export const defaultChoice = (label: string): ButtonChoice => ({
  label,
  radius: 24,
  fill: 'primary',
});

/** Trims to the max length and falls back to a placeholder when empty. */
export function shownLabel(label: string, fallback: string, max: number): string {
  const trimmed = label.slice(0, max).trim();
  return trimmed === '' ? fallback : trimmed;
}

export function clampRadius(value: number): number {
  if (!Number.isFinite(value)) return defaultChoice('').radius;
  return Math.min(RADIUS_MAX, Math.max(RADIUS_MIN, Math.round(value)));
}

export function fillById(id: FillId) {
  return fills.find((f) => f.id === id) ?? fills[0]!;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const t = (text: string, kind: CodeToken['kind']): CodeToken => ({ text, kind });

/**
 * Real HTML + CSS with the colours resolved for the current theme, so the
 * snippet works when pasted anywhere (review m5: no site-only class names).
 */
export function buildButtonCode(choice: ButtonChoice, label: string, palette: Palette): CodeLine[] {
  const fill = fillById(choice.fill);
  return [
    [
      t('<', 'punct'),
      t('button', 'tag'),
      t(' class', 'attr'),
      t('=', 'punct'),
      t('"ping-btn"', 'string'),
      t('>', 'punct'),
    ],
    [t(`  ${escapeHtml(label)}`, 'text')],
    [t('</', 'punct'), t('button', 'tag'), t('>', 'punct')],
    [],
    [t('.ping-btn', 'tag'), t(' {', 'punct')],
    [
      t('  border-radius', 'attr'),
      t(': ', 'punct'),
      t(`${choice.radius}px`, 'string'),
      t(';', 'punct'),
    ],
    [t('  background', 'attr'), t(': ', 'punct'), t(palette[fill.bg], 'string'), t(';', 'punct')],
    [t('  color', 'attr'), t(': ', 'punct'), t(palette[fill.fg], 'string'), t(';', 'punct')],
    [t('}', 'punct')],
  ];
}

/** Plain text of highlighted lines, for the Copy button. */
export function codeToText(lines: readonly CodeLine[]): string {
  return lines.map((line) => line.map((token) => token.text).join('')).join('\n');
}
