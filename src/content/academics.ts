import type { Milestone, SectionIntro } from './schema';

export const academicsIntro: SectionIntro = {
  number: '02',
  eyebrow: 'Academics',
  title: 'The Journey',
  // Kelvin's wording with spelling fixed ("Persuing a Bachelors Degree in…").
  body: "Pursuing a Bachelor's degree at the University of Southern Maine. Here's where things stand.",
};

/** ISO date so it can be formatted (and checked) instead of hand-typed. */
export const graduationDate = '2027-12-17';

// The "Now" card's heading and course list come from this term object, so
// nothing says "Fall 2026" after the term ends (review m7). Update each term.
export const milestones: readonly Milestone[] = [
  { state: 'done', title: 'Associate Degree', detail: 'Southern Maine Community College' },
  {
    state: 'done',
    title: 'Transferred to USM',
    detail: 'B.S. in Computer Science with a minor in Cybersecurity',
  },
  {
    state: 'now',
    term: {
      season: 'Fall',
      year: 2026,
      courses: [
        { code: 'COS 322', name: 'Foundations of Machine Learning' },
        { code: 'ITT 451', name: 'Cyber Laws, Policies and Ethics' },
        { code: 'ITT 272', name: 'Networking I' },
        { code: 'MAT 295', name: 'Linear Algebra' },
      ],
    },
  },
  { state: 'next', title: 'B.S. Computer Science', detail: 'Cybersecurity minor. Graduating' },
];

export const milestoneLabels = {
  done: 'Done',
  now: 'Now',
  next: 'Next',
  listLabel: 'Academic progress',
  coursesLabel: (term: string) => `${term} courses`,
} as const;
