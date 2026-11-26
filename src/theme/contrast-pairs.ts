import type { ColorToken } from './colors';

// Every foreground/background pair the site actually draws text or a control
// on. Adding a new pairing to a component means adding a row here.
export type Pair = {
  /** Where it shows up, for the report. */
  where: string;
  fg: ColorToken;
  /** Background layers, top first. The last one must be opaque. */
  bg: readonly ColorToken[];
  /** text = 4.5:1 (body copy); ui = 3:1 (large text, icons, control edges). */
  kind: 'text' | 'ui';
};

const text = (where: string, fg: ColorToken, ...bg: ColorToken[]): Pair => ({
  where,
  fg,
  bg,
  kind: 'text',
});
const ui = (where: string, fg: ColorToken, ...bg: ColorToken[]): Pair => ({
  where,
  fg,
  bg,
  kind: 'ui',
});

export const pairs: readonly Pair[] = [
  // Page text
  text('Body on canvas', 'on-surface', 'surface'),
  text('Body on canvas glow', 'on-surface', 'glow', 'surface'),
  text('Muted on canvas', 'on-surface-var', 'surface'),
  text('Muted on canvas glow', 'on-surface-var', 'glow', 'surface'),
  text('Muted on academics band', 'on-surface-var', 'surface-c'),
  text('Body on academics band', 'on-surface', 'surface-c'),
  text('Body on high surface', 'on-surface', 'surface-high'),
  text('Muted on high surface', 'on-surface-var', 'surface-high'),
  text('Link / eyebrow on canvas', 'primary', 'surface'),
  text('Eyebrow on demo card', 'primary', 'surface-high'),
  text('Link on academics band', 'primary', 'surface-c'),

  // Brand fills
  text('Primary button', 'on-primary', 'primary'),
  text('ClassPing card', 'on-primary-c', 'primary-c'),
  text('Lime chip / NativeX card', 'on-tertiary-c', 'tertiary-c'),
  text('NativeX art panel', 'on-tertiary-c', 'tertiary-panel'),
  text('NativeX button (inverted)', 'tertiary-c', 'on-tertiary-c'),
  text('Skills4u card', 'on-secondary-c', 'secondary-c'),
  text('Skills4u art panel', 'on-secondary-c', 'secondary-panel'),
  text('Skills4u button (inverted)', 'secondary-c', 'on-secondary-c'),
  text('Now badge on ClassPing tone', 'on-primary', 'primary'),

  // Contrast (inverse) cards
  text('Inverse card', 'on-inverse', 'inverse'),
  text('Inverse muted copy', 'on-inverse-var', 'inverse'),
  text('Inverse raised chip', 'on-inverse', 'inverse-raised'),
  text('Lime label on inverse', 'ia', 'inverse'),
  text('Lime button', 'on-ia', 'ia'),

  // Code viewer
  text('Code tag', 'code-tag', 'inverse'),
  text('Code attribute', 'code-attr', 'inverse'),
  text('Code string', 'code-string', 'inverse'),
  text('Code muted', 'code-muted', 'inverse'),
  text('Code file bar', 'on-inverse', 'inverse-raised'),

  // Glass nav + menu sheet, measured over the worst thing that can scroll under
  // it (no blur averaging assumed, so this is the pessimistic case).
  ...(
    [
      'surface',
      'surface-c',
      'surface-high',
      'primary',
      'primary-c',
      'on-primary-c',
      'tertiary-c',
      'secondary-c',
      'inverse',
      'ia',
      'on-surface',
    ] as const
  ).flatMap((under) => [text(`Glass nav text over ${under}`, 'on-surface', 'glass', under)]),
  text('Glass fallback (reduced transparency)', 'on-surface', 'glass-solid'),

  // Controls and focus (non-text, 3:1)
  ui('Input border on canvas', 'outline', 'surface'),
  ui('Input border on demo card', 'outline', 'surface-high'),
  ui('Primary button edge on canvas', 'primary', 'surface'),
  ui('Selected swatch ring', 'on-surface', 'surface-high'),
  // Revamp 2026-11-26: lines that carry meaning (travelled vs ahead).
  ui('Timeline squiggle on academics band', 'primary', 'surface-c'),
  ui('Timeline dot on its card ring', 'primary', 'primary-c'),
  ui('Career curve and nodes on the path banner', 'primary', 'primary-c'),
  ui('Nav underline on glass fallback', 'primary', 'glass-solid'),
  ui('Project chevron button on inverse card', 'on-inverse', 'inverse'),
];

// Two-ring focus indicator: an outer `focus-a` ring and an inner `focus-b`
// ring. On every background at least one of the two must reach 3:1.
export const focusBackgrounds: readonly ColorToken[] = [
  'surface',
  'surface-c',
  'surface-high',
  'primary',
  'primary-c',
  'tertiary-c',
  'secondary-c',
  'inverse',
  'ia',
];
