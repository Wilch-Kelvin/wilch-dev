import type { Term } from '@/content/schema';

/** "2027-12-17" → "Dec 17, 2027". UTC so the day never shifts by time zone. */
export function formatShortDate(iso: string): string {
  const date = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) throw new Error(`Not an ISO date: ${iso}`);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

/** "Fall 2026": the "Now" card heading, built from data (review m7). */
export function termLabel(term: Pick<Term, 'season' | 'year'>): string {
  return `${term.season} ${term.year}`;
}

/** "© 2026 Kelvin Wilch", with the year of the build. */
export function copyrightLine(name: string, year: number): string {
  return `© ${year} ${name}`;
}
