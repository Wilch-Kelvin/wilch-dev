import { absoluteUrl } from './url';

// Structured data (schema.org Person) so search engines connect the site to
// Kelvin's GitHub and LinkedIn. No email: that would undo the scraping guard.

export type PersonInput = {
  name: string;
  jobTitle: string;
  school: string;
  sameAs: readonly string[];
};

export function personJsonLd(person: PersonInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: person.name,
    url: absoluteUrl('/'),
    jobTitle: person.jobTitle,
    affiliation: { '@type': 'CollegeOrUniversity', name: person.school },
    sameAs: [...person.sameAs],
  } as const;
}

/** JSON for a <script> tag, with "<" escaped so it can never close the tag. */
export function safeJson(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}
