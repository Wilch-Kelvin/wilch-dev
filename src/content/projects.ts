import type { Project, SectionIntro } from './schema';

export const projectsIntro: SectionIntro = {
  number: '01',
  eyebrow: 'Projects',
  title: "Stuff I'm building",
  body: "Four projects I'm putting hours into right now, from a campus app to an offline AI mentor.",
};

// Kelvin's card text, split into an always-visible summary and the sentence(s)
// behind the "More" button (review M1). The words themselves are unchanged.
export const projects: readonly Project[] = [
  {
    id: 'classping',
    name: 'ClassPing',
    meta: 'Flagship · classping.space',
    summary: 'My main project. ClassPing is built for students around campus.',
    details:
      "It started as a web app and now has a Chrome extension, a native iOS app I'm writing in SwiftUI, and Android early access.",
    chipsLabel: 'Platforms',
    chips: ['Web app', 'Chrome extension', 'iOS · SwiftUI', 'Android early access'],
    link: { label: 'Visit ClassPing', href: 'https://classping.space/welcome' },
    tone: 'primary',
    openByDefault: true,
    screenshot: null,
  },
  {
    id: 'ro5n3r',
    name: 'Ro5n3R',
    meta: 'Chrome extension · JavaScript',
    summary:
      "Ro5n3R replaces Chrome's new tab page with Material-inspired widgets in fun, irregular shapes.",
    details: "A lot of this site's style comes straight from it.",
    chipsLabel: 'Highlights',
    chips: ['New tab page', 'Irregular widgets', 'Material-inspired'],
    // Review m4: every link label is unique.
    link: { label: 'View Ro5n3R on GitHub', href: 'https://github.com/Wilch-Kelvin/Ro5n3R' },
    tone: 'inverse',
    openByDefault: false,
    screenshot: null,
  },
  {
    id: 'nativex',
    name: 'NativeX',
    meta: 'Desktop app · In progress',
    summary: 'An offline coding mentor for people new to agentic coding.',
    details:
      'It runs a local LLM behind a chat UI and ships with skills and agents you can customize, starting with web design.',
    chipsLabel: 'Highlights',
    chips: ['Local LLM', 'Skills + agents', 'Windows + macOS'],
    link: { label: 'View NativeX on GitHub', href: 'https://github.com/Wilch-Kelvin/NativeX' },
    tone: 'tertiary',
    openByDefault: false,
    screenshot: null,
  },
  {
    id: 'skills4u',
    name: 'Skills4u',
    meta: 'Plugin marketplace · Python',
    summary: 'A marketplace of Claude plugins I design.',
    details:
      'Each one packs skills, agents or scripts for a real job, like UI/UX design and review, project docs, wiki health checks and inventory audits, with evals to check they work.',
    chipsLabel: 'Highlights',
    chips: ['Claude plugins', 'Agent skills', 'Evals + tests'],
    link: { label: 'View Skills4u on GitHub', href: 'https://github.com/Wilch-Kelvin/skills4u' },
    tone: 'secondary',
    openByDefault: false,
    screenshot: null,
  },
];

export const projectCard = {
  more: 'More',
  less: 'Less',
  /** Builds the disclosure's accessible name: "More about Ro5n3R". */
  moreAbout: (name: string) => `More about ${name}`,
} as const;

export const projectsMore = {
  label: 'See everything on GitHub',
  href: 'https://github.com/Wilch-Kelvin',
} as const;
