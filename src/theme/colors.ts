// The one source of truth for every colour on the site.
//
// Each token has a light and a true-black dark value, named after its
// Material 3 role (surface, primary, on-primary…). Components only ever use
// the role names, so a theme switch changes values, never code.
// `tokens-css.ts` turns this object into CSS variables, and
// `contrast.test.ts` checks every text pair against WCAG AA.

export type ColorToken =
  // Surfaces (M3 tonal roles: canvas → container → high)
  | 'surface'
  | 'surface-c'
  | 'surface-high'
  | 'on-surface'
  | 'on-surface-var'
  | 'outline'
  | 'outline-var'
  // Brand: indigo primary
  | 'primary'
  | 'on-primary'
  | 'primary-c'
  | 'on-primary-c'
  // Accent: lime tertiary
  | 'tertiary-c'
  | 'on-tertiary-c'
  | 'tertiary-panel'
  // Warm secondary (peach)
  | 'secondary-c'
  | 'on-secondary-c'
  | 'secondary-panel'
  // The dark "contrast" card used for Ro5n3R, Skills and Contact
  | 'inverse'
  | 'on-inverse'
  | 'on-inverse-var'
  | 'inverse-raised'
  | 'ia'
  | 'on-ia'
  // Code syntax colours (always drawn on `inverse`)
  | 'code-tag'
  | 'code-attr'
  | 'code-string'
  | 'code-muted'
  // Glass, hairlines, glow, focus
  | 'hairline'
  | 'glass'
  | 'glass-solid'
  | 'glass-edge'
  | 'glass-shine'
  | 'glow'
  | 'scrim'
  | 'focus-a'
  | 'focus-b'
  | 'shadow';

export type Palette = Readonly<Record<ColorToken, string>>;

export const colors: { readonly light: Palette; readonly dark: Palette } = {
  light: {
    surface: '#FBF8FF',
    'surface-c': '#F0ECF8',
    'surface-high': '#E6E1F1',
    'on-surface': '#1C1A23',
    'on-surface-var': '#48455A',
    outline: '#75718A',
    'outline-var': '#CBC5DB',

    primary: '#4F3FD9',
    'on-primary': '#FFFFFF',
    'primary-c': '#E3DFFF',
    'on-primary-c': '#170F63',

    'tertiary-c': '#D4F26A',
    'on-tertiary-c': '#1F2B00',
    'tertiary-panel': '#C6E363',

    'secondary-c': '#FFDCCD',
    'on-secondary-c': '#3A1405',
    'secondary-panel': '#F2CDBD',

    inverse: '#25232D',
    'on-inverse': '#F3EFFA',
    'on-inverse-var': '#D2CEDB',
    'inverse-raised': '#3A3842',
    ia: '#D4F26A',
    'on-ia': '#1F2B00',

    'code-tag': '#D4F26A',
    'code-attr': '#C6BFFF',
    'code-string': '#FFC2A8',
    'code-muted': '#A9A5B6',

    hairline: 'rgba(28, 26, 35, 0.10)',
    glass: 'rgba(230, 225, 241, 0.72)',
    'glass-solid': '#E6E1F1',
    'glass-edge': 'rgba(28, 26, 35, 0.10)',
    'glass-shine': 'rgba(255, 255, 255, 0.70)',
    glow: 'rgba(79, 63, 217, 0.10)',
    scrim: 'rgba(28, 26, 35, 0.40)',
    'focus-a': '#4F3FD9',
    'focus-b': '#FFFFFF',
    shadow: 'rgba(28, 22, 70, 0.22)',
  },
  dark: {
    // True black canvas; raised surfaces are smoky, not grey-blue.
    surface: '#000000',
    'surface-c': '#0E0E10',
    'surface-high': '#1A1A1D',
    'on-surface': '#F3EFFA',
    'on-surface-var': '#C9C4D8',
    outline: '#8E8A9E',
    'outline-var': '#3A3744',

    primary: '#C6BFFF',
    'on-primary': '#20168A',
    'primary-c': '#3527B0',
    'on-primary-c': '#E6E2FF',

    'tertiary-c': '#3E5200',
    'on-tertiary-c': '#D7F47A',
    'tertiary-panel': '#33440A',

    'secondary-c': '#6B2E14',
    'on-secondary-c': '#FFDCCD',
    'secondary-panel': '#5A2812',

    // On true black the contrast card stays dark (smoky) and the lime accent
    // takes over, instead of flipping to a bright white card.
    inverse: '#16151B',
    'on-inverse': '#F3EFFA',
    'on-inverse-var': '#C9C4D8',
    'inverse-raised': '#26252D',
    ia: '#D4F26A',
    'on-ia': '#1F2B00',

    'code-tag': '#D4F26A',
    'code-attr': '#C6BFFF',
    'code-string': '#FFC2A8',
    'code-muted': '#A9A5B6',

    hairline: 'rgba(255, 255, 255, 0.12)',
    glass: 'rgba(26, 26, 29, 0.72)',
    'glass-solid': '#1A1A1D',
    'glass-edge': 'rgba(255, 255, 255, 0.14)',
    'glass-shine': 'rgba(255, 255, 255, 0.10)',
    glow: 'rgba(110, 96, 240, 0.18)',
    scrim: 'rgba(0, 0, 0, 0.60)',
    'focus-a': '#C6BFFF',
    'focus-b': '#000000',
    shadow: 'rgba(0, 0, 0, 0.70)',
  },
};
