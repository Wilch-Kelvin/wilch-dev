import type { Education, SectionIntro, SkillGroup } from './schema';

export const resumeIntro: SectionIntro = {
  eyebrow: 'Resume',
  title: 'The short version',
  body: "Where I've studied and the tools I actually use. Grab the PDF for the full thing.",
};

// The PDF is emailed, not linked (Kelvin, 2026-11-26): it has his phone
// number on it. Visitors get a 15-minute link in their inbox, which proves
// the address is theirs, and Kelvin gets a copy of who downloaded it. Until
// the email settings exist in Vercel the site shows `pending` instead.
export const resumeGate = {
  label: 'Download PDF',
  pending: 'PDF coming soon',
  formTitle: 'Get the PDF by email',
  emailLabel: 'Your email',
  emailPlaceholder: 'you@company.com',
  submit: 'Email me the link',
  sending: 'Sending…',
  note: "I'll email you a download link that works for 15 minutes. When you use it, I get a copy of your address, because the PDF has my phone number on it.",
  sentTitle: 'Check your inbox',
  sent: (email: string) =>
    `The link is on its way to ${email}. It works for 15 minutes. Can't see it? Check spam.`,
  again: 'Use a different email',
  close: 'Close',
  // Shown when someone comes back from a link that didn't work.
  returned: {
    expired: 'That link has expired. Ask for a new one below.',
    invalid: "That link didn't work. Ask for a new one below.",
    unavailable: "The PDF isn't available right now. Please email me instead.",
  },
  errors: {
    invalid_email: "That email address doesn't look right. Check it and try again.",
    slow_down: 'Too many tries. Please wait a while, or email me instead.',
    email_failed: "I couldn't send the email just now. Please try again in a minute.",
    not_configured: "The PDF isn't available right now. Please email me instead.",
    network: "Couldn't reach the site. Check your connection and try again.",
  },
} as const;

export type ResumeErrorCode = keyof typeof resumeGate.errors;
export type ResumeReturnReason = keyof typeof resumeGate.returned;

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
