import { createResumeToken, RESUME_LINK_TTL_MS, verifyResumeToken } from './resume-token';

const secret = 'x'.repeat(40);
const now = 1_800_000_000_000;

describe('resume token', () => {
  it('round-trips the email until it expires', () => {
    const token = createResumeToken('ada@example.com', secret, now);
    const result = verifyResumeToken(token, secret, now + RESUME_LINK_TTL_MS - 1);
    expect(result).toEqual({
      ok: true,
      payload: { email: 'ada@example.com', exp: now + RESUME_LINK_TTL_MS },
    });
  });

  it('expires after 15 minutes', () => {
    const token = createResumeToken('ada@example.com', secret, now);
    expect(verifyResumeToken(token, secret, now + RESUME_LINK_TTL_MS)).toEqual({
      ok: false,
      reason: 'expired',
    });
  });

  it('rejects a token signed with another secret', () => {
    const token = createResumeToken('ada@example.com', 'y'.repeat(40), now);
    expect(verifyResumeToken(token, secret, now)).toMatchObject({ reason: 'bad_signature' });
  });

  it('rejects a payload that was edited (e.g. a later expiry)', () => {
    const [, sig] = createResumeToken('ada@example.com', secret, now).split('.');
    const forged = Buffer.from(JSON.stringify({ email: 'ada@example.com', exp: now * 2 })).toString(
      'base64url',
    );
    expect(verifyResumeToken(`${forged}.${sig}`, secret, now)).toMatchObject({
      reason: 'bad_signature',
    });
  });

  it.each(['', 'abc', 'a.b.c', '.sig', 'body.'])('calls %j malformed or unsigned', (token) => {
    const result = verifyResumeToken(token, secret, now);
    expect(result.ok).toBe(false);
  });

  it('refuses to sign with a short secret', () => {
    expect(() => createResumeToken('ada@example.com', 'short', now)).toThrow(/32 characters/);
  });
});
