import { pickActiveSection } from './active-section';

const ids = ['projects', 'academics', 'resume', 'contact'] as const;

describe('pickActiveSection', () => {
  it('returns null when nothing is in the band (hero)', () => {
    expect(pickActiveSection(ids, new Map())).toBeNull();
  });
  it('prefers the earliest visible section in page order', () => {
    const ratios = new Map([
      ['resume', 0.4],
      ['academics', 0.1],
    ]);
    expect(pickActiveSection(ids, ratios)).toBe('academics');
  });
  it('ignores sections that have left the band', () => {
    expect(
      pickActiveSection(
        ids,
        new Map([
          ['projects', 0],
          ['contact', 1],
        ]),
      ),
    ).toBe('contact');
  });
});
