import {
  downloadNoticeEmail,
  downloadUrl,
  escapeHtml,
  linkEmail,
  RateLimiter,
  ResumeRequestBody,
} from './resume-request';

describe('ResumeRequestBody', () => {
  it('trims and lower-cases the email, honeypot defaults to empty', () => {
    expect(ResumeRequestBody.parse({ email: '  Ada@Example.COM ' })).toEqual({
      email: 'ada@example.com',
      website: '',
    });
  });

  it.each([{}, { email: '' }, { email: 'not-an-email' }, { email: 'a@b' }, null, 'x'])(
    'rejects %j',
    (body) => {
      expect(ResumeRequestBody.safeParse(body).success).toBe(false);
    },
  );

  it('rejects an address longer than email allows', () => {
    const email = `${'a'.repeat(250)}@x.io`;
    expect(ResumeRequestBody.safeParse({ email }).success).toBe(false);
  });
});

describe('RateLimiter', () => {
  it('allows up to the limit, then blocks until the window ends', () => {
    const limiter = new RateLimiter({ limit: 2, windowMs: 1000 });
    expect(limiter.take('k', 0)).toBe(true);
    expect(limiter.take('k', 10)).toBe(true);
    expect(limiter.take('k', 20)).toBe(false);
    expect(limiter.take('other', 20)).toBe(true);
    expect(limiter.take('k', 1000)).toBe(true);
  });
});

describe('emails', () => {
  it('escapes anything a visitor typed before it goes into HTML', () => {
    expect(escapeHtml(`<a href="x">'&'</a>`)).toBe(
      '&lt;a href=&quot;x&quot;&gt;&#39;&amp;&#39;&lt;/a&gt;',
    );
    const notice = downloadNoticeEmail('me@x.io', '<script>@x.io', new Date(0));
    expect(notice.html).not.toContain('<script>');
    expect(notice.html).toContain('&lt;script&gt;@x.io');
  });

  it('builds the link with the token URL-encoded', () => {
    expect(downloadUrl('https://wilch.dev', 'a+b/c')).toBe(
      'https://wilch.dev/api/resume/download/?t=a%2Bb%2Fc',
    );
  });

  it('link email has the link, the expiry and an ignore line', () => {
    const msg = linkEmail('ada@example.com', 'https://wilch.dev/x?t=1&u=2', 15);
    expect(msg.to).toBe('ada@example.com');
    expect(msg.text).toContain('https://wilch.dev/x?t=1&u=2');
    expect(msg.html).toContain('href="https://wilch.dev/x?t=1&amp;u=2"');
    expect(msg.text).toContain('15 minutes');
    expect(msg.text).toContain("Didn't ask for this?");
  });

  it("Kelvin's notice names the visitor and the time", () => {
    const msg = downloadNoticeEmail('me@x.io', 'ada@example.com', new Date('2026-11-26T14:05:00Z'));
    expect(msg.subject).toBe('Resume downloaded by ada@example.com');
    expect(msg.text).toContain('2026-11-26 14:05 UTC');
  });
});
