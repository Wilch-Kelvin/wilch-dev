import { z } from 'zod';

// Pure pieces of the "email me the resume" flow: what the form may send,
// how often, and what the two emails say. The route handlers only wire these
// to the network, so all of this is unit-tested without sending anything.

/**
 * The request body. `website` is a honeypot: the field is hidden from people,
 * so only bots fill it in. We answer a filled honeypot with the same "check
 * your inbox" as a real request, so a bot can't tell it was caught.
 */
export const ResumeRequestBody = z.object({
  email: z.string().trim().toLowerCase().max(254).pipe(z.email()),
  website: z.string().max(200).optional().default(''),
});
export type ResumeRequest = z.infer<typeof ResumeRequestBody>;

// ── Rate limiting ──────────────────────────────────────────────────────────
// Every request sends a real email, which costs money and could be used to
// spam someone else's inbox. So each IP and each address gets a small budget.
// This lives in the function's memory: good enough to stop a burst, but each
// Vercel instance keeps its own count. A Vercel Firewall rate-limit rule on
// /api/resume is the stronger layer if this ever gets abused.

export type RateRule = { readonly limit: number; readonly windowMs: number };

export const RESUME_RATE_RULES = {
  /** Per visitor IP: a few tries for typos. */
  ip: { limit: 5, windowMs: 60 * 60 * 1000 },
  /** Per recipient address: stops someone flooding one inbox. */
  email: { limit: 3, windowMs: 60 * 60 * 1000 },
} as const satisfies Record<string, RateRule>;

/** A fixed-window counter. `now` is passed in so tests control the clock. */
export class RateLimiter {
  private readonly hits = new Map<string, { count: number; resetAt: number }>();

  constructor(private readonly rule: RateRule) {}

  /** Records one attempt and says whether it is allowed. */
  take(key: string, now: number): boolean {
    const entry = this.hits.get(key);
    if (!entry || now >= entry.resetAt) {
      this.hits.set(key, { count: 1, resetAt: now + this.rule.windowMs });
      this.prune(now);
      return true;
    }
    entry.count += 1;
    return entry.count <= this.rule.limit;
  }

  /** Drops finished windows so a long-lived instance doesn't grow forever. */
  private prune(now: number): void {
    if (this.hits.size < 1000) return;
    for (const [key, entry] of this.hits) if (now >= entry.resetAt) this.hits.delete(key);
  }
}

// ── Emails ─────────────────────────────────────────────────────────────────

export type EmailMessage = {
  readonly to: string;
  readonly subject: string;
  readonly text: string;
  readonly html: string;
};

/** Anything a visitor typed goes through this before it touches HTML. */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** The emailed link. trailingSlash is on, so the route path ends in "/". */
export function downloadUrl(origin: string, token: string): string {
  return `${origin}/api/resume/download/?t=${encodeURIComponent(token)}`;
}

export function linkEmail(to: string, url: string, minutes: number): EmailMessage {
  const subject = "Kelvin Wilch's resume";
  const text = [
    'Hi,',
    '',
    "Thanks for asking for my resume. Here's your download link:",
    url,
    '',
    `It works for ${minutes} minutes. If it runs out, ask again on wilch.dev.`,
    '',
    'Kelvin Wilch',
    '',
    "Didn't ask for this? You can ignore this email.",
  ].join('\n');
  const html = `<p>Hi,</p>
<p>Thanks for asking for my resume. Here's your download link:</p>
<p><a href="${escapeHtml(url)}">Download Kelvin Wilch's resume (PDF)</a></p>
<p>It works for ${minutes} minutes. If it runs out, ask again on wilch.dev.</p>
<p>Kelvin Wilch</p>
<p style="color:#666;font-size:13px">Didn't ask for this? You can ignore this email.</p>`;
  return { to, subject, text, html };
}

/** Kelvin's copy: sent when a verified visitor actually downloads. */
export function downloadNoticeEmail(to: string, visitor: string, at: Date): EmailMessage {
  const when = at.toISOString().replace('T', ' ').slice(0, 16) + ' UTC';
  const subject = `Resume downloaded by ${visitor}`;
  const text = `${visitor} downloaded your resume from wilch.dev at ${when}.\nThey opened the emailed link, so the address is theirs.`;
  const html = `<p><strong>${escapeHtml(visitor)}</strong> downloaded your resume from wilch.dev at ${when}.</p>
<p>They opened the emailed link, so the address is theirs.</p>`;
  return { to, subject, text, html };
}
