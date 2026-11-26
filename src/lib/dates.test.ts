import { copyrightLine, formatShortDate, termLabel } from './dates';

describe('dates', () => {
  it('formats the graduation date without time-zone drift', () => {
    expect(formatShortDate('2027-12-17')).toBe('Dec 17, 2027');
    expect(formatShortDate('2027-01-01')).toBe('Jan 1, 2027');
  });

  it('rejects a bad date', () => {
    expect(() => formatShortDate('someday')).toThrow();
  });

  it('labels a term from data', () => {
    expect(termLabel({ season: 'Spring', year: 2027 })).toBe('Spring 2027');
  });

  it('builds the copyright line', () => {
    expect(copyrightLine('Kelvin Wilch', 2026)).toBe('© 2026 Kelvin Wilch');
  });
});
