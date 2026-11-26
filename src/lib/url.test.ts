import { absoluteUrl, SITE_ORIGIN } from './url';

describe('absoluteUrl', () => {
  it('returns the origin with a trailing slash for the root', () => {
    expect(absoluteUrl('/')).toBe(`${SITE_ORIGIN}/`);
  });
  it('adds a missing leading slash', () => {
    expect(absoluteUrl('resume.pdf')).toBe('https://wilch.dev/resume.pdf');
  });
});
