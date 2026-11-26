import { newResumePathname, pickLatest, RESUME_BLOB_PREFIX } from './resume-blob';

describe('resume blob', () => {
  it('puts the PDF under a 128-bit random folder', () => {
    const path = newResumePathname(Buffer.alloc(16, 0xab));
    expect(path).toBe(`${RESUME_BLOB_PREFIX}${'ab'.repeat(16)}/Kelvin-Wilch-Resume.pdf`);
    expect(newResumePathname()).toMatch(/^resume\/[0-9a-f]{32}\/Kelvin-Wilch-Resume\.pdf$/);
    expect(newResumePathname()).not.toBe(newResumePathname());
  });

  it('picks the newest upload, or null when there is none', () => {
    const a = { id: 'a', uploadedAt: new Date(1) };
    const b = { id: 'b', uploadedAt: new Date(2) };
    expect(pickLatest([a, b])).toBe(b);
    expect(pickLatest([b, a])).toBe(b);
    expect(pickLatest([])).toBeNull();
  });
});
