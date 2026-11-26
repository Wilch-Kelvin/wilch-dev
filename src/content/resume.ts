import type { Education, SectionIntro, SkillGroup } from './schema';

export const resumeIntro: SectionIntro = {
  eyebrow: 'Resume',
  title: 'The short version',
  body: "Where I've studied and the tools I actually use. Grab the PDF for the full thing.",
};

export const resumePdf = {
  label: 'Download PDF',
  // TODO(Kelvin): add public/resume.pdf, then set href: '/resume.pdf' and the
  // updated date. Until then the page shows "PDF coming soon" instead of a
  // dead link (review B1).
  href: null as `/${string}` | null,
  updated: null as string | null,
  pending: 'PDF coming soon',
} as const;

export const education: readonly Education[] = [
  {
    degree: 'B.S. Computer Science',
    school: 'University of Southern Maine · Minor in Cybersecurity',
    status: 'In progress',
  },
  { degree: 'Associate Degree', school: 'Southern Maine Community College', status: 'Completed' },
];

// Review M3 asked for Swift/SwiftUI and Git; both are backed by Kelvin's own
// project copy (ClassPing's SwiftUI app, everything on GitHub).
// TODO(Kelvin): confirm, and decide on Linux and a Security group.
export const skillGroups: readonly SkillGroup[] = [
  { label: 'Languages', items: ['Python', 'Java', 'JavaScript', 'TypeScript', 'Swift'] },
  { label: 'Web', items: ['React 18', 'HTML5', 'CSS3', 'Tailwind CSS'] },
  { label: 'Tools', items: ['SwiftUI', 'Git', 'Chrome extensions'] },
];

export const resumeHeadings = {
  education: 'Education',
  skills: 'Skills',
} as const;

// "Where I'm headed": Kelvin cleared the heading and the three steps on
// 2026-11-26 and asked for the banner to stay empty for now. Only the drawn
// path is left (cookie nodes joined by a curve), so the card is decorative.
// TODO(Kelvin): new wording for this banner; see docs/COPY.md.
export const careerNodeCount = 3;
