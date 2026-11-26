import type { CareerStep, Education, SectionIntro, SkillGroup } from './schema';

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
  path: "Where I'm headed",
} as const;

export const careerPath: readonly CareerStep[] = [
  { title: 'Software engineering', detail: 'Web, extensions and iOS' },
  { title: 'DevOps', detail: 'Into Linux and self-hosting' },
  { title: 'Cybersecurity', detail: 'The long-term goal' },
];
