import type { ExternalLink, NavItem } from './schema';

export const person = {
  firstName: 'Kelvin',
  fullName: 'Kelvin Wilch',
} as const;

export const nav = {
  brand: 'Kelvin',
  homeLabel: 'Kelvin Wilch, back to top',
  items: [
    { label: 'Projects', target: 'projects' },
    { label: 'Academics', target: 'academics' },
    { label: 'Resume', target: 'resume' },
    { label: 'Contact', target: 'contact' },
  ] satisfies readonly NavItem[],
  /** Design review M4: Résumé is the filled button, GitHub a plain icon link. */
  cta: { label: 'Resume', target: 'resume' } satisfies NavItem,
  github: { label: 'GitHub', href: 'https://github.com/Wilch-Kelvin' } satisfies ExternalLink,
  githubAria: 'Kelvin Wilch on GitHub',
  skip: 'Skip to projects',
  menuOpen: 'Open menu',
  menuClose: 'Close menu',
  themeToDark: 'Switch to dark theme',
  themeToLight: 'Switch to light theme',
  progress: 'Reading progress',
} as const;

export const footer = {
  copy: '© 2026 Kelvin Wilch',
  tagline: 'Design Inspired by Flow',
  top: 'Back to top',
  pauseMotion: 'Pause motion',
  playMotion: 'Play motion',
} as const;
