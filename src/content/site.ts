import type { ExternalLink, NavItem } from './schema';

// Site-wide copy: who, nav, hero, contact and footer. Wording comes from
// docs/COPY.md; change it here and note the change there.

export const person = {
  firstName: 'Kelvin',
  fullName: 'Kelvin Wilch',
  role: 'Computer Science and Cybersecurity student',
  school: 'University of Southern Maine',
} as const;

export const meta = {
  title: 'Kelvin Wilch | Computer Science and Cybersecurity student',
  description:
    'Kelvin Wilch studies Computer Science with a Cybersecurity minor at the University of Southern Maine. Projects in web, browser extensions, iOS and agentic engineering.',
  ogAlt: 'Kelvin Wilch, Computer Science and Cybersecurity student',
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
} as const;

export const hero = {
  greeting: "Hi, I'm",
  name: 'Kelvin.',
  body: "I study Computer Science at the University of Southern Maine with a minor in Cybersecurity. I enjoy WebDev, Agentic Engineering, and I'm working my way toward DevOps and security.",
  // Review B3: say what Kelvin is looking for.
  // TODO(Kelvin): add the season and year, e.g. "Seeking summer 2027 internships…".
  seeking: 'Seeking internships in software engineering, DevOps and security.',
  primaryCta: { label: 'Curious', target: 'projects' } satisfies NavItem,
  secondaryCta: { label: 'Resume', target: 'resume' } satisfies NavItem,
  /** Glass name tag over the hero art (decorative; the name is also in <title>). */
  nameTag: 'Kelvin Wilch',
} as const;

export const contact = {
  title: "Let's build something!",
  body: 'Got a project, a role, or a question? Hit me up.',
  github: {
    label: 'github.com/Wilch-Kelvin',
    href: 'https://github.com/Wilch-Kelvin',
  } satisfies ExternalLink,
  linkedin: {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/kelvin-wilch-5705b1405/',
  } satisfies ExternalLink,
  // Kept in two parts with no "@" so simple scrapers reading the HTML or the
  // JS bundle don't match an address. The page joins them after it loads.
  email: { user: 'kelvinmusiomi99', domain: 'gmail.com' },
  emailFallback: 'Email me',
  copyEmail: 'Copy email address',
  copied: 'Email copied',
} as const;

export const footer = {
  copyName: 'Kelvin Wilch',
  tagline: 'Design Inspired by Flow',
  top: 'Back to top',
  pauseMotion: 'Pause motion',
  playMotion: 'Play motion',
} as const;

export const notFound = {
  title: 'Nothing here.',
  body: "That page doesn't exist, or it moved. The rest of the site is one tap away.",
  cta: 'Back to the home page',
  metaTitle: 'Page not found',
} as const;
