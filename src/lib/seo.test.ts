import { personJsonLd, safeJson } from './seo';

describe('seo', () => {
  const ld = personJsonLd({
    name: 'Kelvin Wilch',
    jobTitle: 'Student',
    school: 'University of Southern Maine',
    sameAs: ['https://github.com/Wilch-Kelvin'],
  });

  it('describes a Person on wilch.dev', () => {
    expect(ld['@type']).toBe('Person');
    expect(ld.url).toBe('https://wilch.dev/');
    expect(ld.sameAs).toContain('https://github.com/Wilch-Kelvin');
  });

  it('never includes an email', () => {
    expect(JSON.stringify(ld)).not.toMatch(/@\w+\.\w+/);
  });

  it('escapes < so the JSON cannot break out of a script tag', () => {
    expect(safeJson({ a: '</script>' })).toBe('{"a":"\\u003c/script>"}');
  });
});
