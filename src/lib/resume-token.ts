import { createHmac, timingSafeEqual } from 'node:crypto';

// The emailed download link carries a signed token instead of a database
// row. The token says "this email may download until this time" and an HMAC
// (a keyed hash only our server can make, because only it knows the secret)
// proves we wrote it. Change one character and the signature no longer
// matches, so nobody can forge a link or stretch its expiry.
//
// Format: base64url(JSON payload) + "." + base64url(HMAC-SHA256 of that part)

/** How long an emailed link works. Short, so a forwarded email goes stale. */
export const RESUME_LINK_TTL_MS = 15 * 60 * 1000;

export type ResumeTokenPayload = {
  /** The verified visitor's email (they had to open their inbox to get here). */
  readonly email: string;
  /** Expiry, as milliseconds since 1970. */
  readonly exp: number;
};

export type VerifyResult =
  | { readonly ok: true; readonly payload: ResumeTokenPayload }
  | { readonly ok: false; readonly reason: 'malformed' | 'bad_signature' | 'expired' };

const sign = (data: string, secret: string): Buffer =>
  createHmac('sha256', secret).update(data).digest();

export function createResumeToken(email: string, secret: string, now: number): string {
  if (secret.length < 32) throw new Error('RESUME_LINK_SECRET must be at least 32 characters');
  const payload: ResumeTokenPayload = { email, exp: now + RESUME_LINK_TTL_MS };
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  return `${body}.${sign(body, secret).toString('base64url')}`;
}

function isPayload(value: unknown): value is ResumeTokenPayload {
  if (typeof value !== 'object' || value === null) return false;
  const { email, exp } = value as Record<string, unknown>;
  return typeof email === 'string' && typeof exp === 'number' && Number.isFinite(exp);
}

export function verifyResumeToken(token: string, secret: string, now: number): VerifyResult {
  const parts = token.split('.');
  if (parts.length !== 2 || !parts[0] || !parts[1]) return { ok: false, reason: 'malformed' };
  const [body, signature] = parts;

  // timingSafeEqual takes as long for a near-miss as for a total miss, so an
  // attacker can't guess the signature one byte at a time by timing us.
  const expected = sign(body, secret);
  const given = Buffer.from(signature, 'base64url');
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) {
    return { ok: false, reason: 'bad_signature' };
  }

  let payload: unknown;
  try {
    payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
  } catch {
    return { ok: false, reason: 'malformed' };
  }
  if (!isPayload(payload)) return { ok: false, reason: 'malformed' };
  if (now >= payload.exp) return { ok: false, reason: 'expired' };
  return { ok: true, payload };
}
