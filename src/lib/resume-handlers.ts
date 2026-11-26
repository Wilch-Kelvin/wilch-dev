import { resumeGate } from '@/content/resume';
import { fail, json } from './http';
import { clientIp, linkOrigin, type ResumeConfig } from './resume-config';
import { RESUME_FILE_NAME } from './resume-blob';
import {
  downloadNoticeEmail,
  downloadUrl,
  linkEmail,
  RESUME_RATE_RULES,
  RateLimiter,
  ResumeRequestBody,
  type EmailMessage,
} from './resume-request';
import { createResumeToken, RESUME_LINK_TTL_MS, verifyResumeToken } from './resume-token';

// The two resume routes as plain functions. The route files pass in the real
// config, clock, mailer and Blob lookup; tests pass fakes. Same code either way.

type Send = (message: EmailMessage) => Promise<boolean>;

export type RequestDeps = {
  readonly config: ResumeConfig | null;
  readonly now: number;
  readonly vercelEnv: string | undefined;
  readonly send: Send;
  readonly limits: { readonly ip: RateLimiter; readonly email: RateLimiter };
};

export function createRequestLimits(): RequestDeps['limits'] {
  return {
    ip: new RateLimiter(RESUME_RATE_RULES.ip),
    email: new RateLimiter(RESUME_RATE_RULES.email),
  };
}

const { errors } = resumeGate;

/** POST /api/resume/request: { email } → emails a 15-minute download link. */
export async function handleResumeRequest(req: Request, deps: RequestDeps): Promise<Response> {
  const { config, now } = deps;
  if (!config) return fail(503, 'not_configured', errors.not_configured);

  const parsed = ResumeRequestBody.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return fail(400, 'invalid_email', errors.invalid_email);
  const { email, website } = parsed.data;

  // Honeypot filled: a bot. Pretend it worked and send nothing.
  if (website) return json(202, { sent: true });

  // Both budgets are spent on every try, so neither can be dodged by
  // switching the other (new address, same IP; or same address, new IP).
  const ipOk = deps.limits.ip.take(clientIp(req.headers), now);
  const emailOk = deps.limits.email.take(email, now);
  if (!ipOk || !emailOk) return fail(429, 'slow_down', errors.slow_down);

  const token = createResumeToken(email, config.linkSecret, now);
  const url = downloadUrl(linkOrigin(req.url, deps.vercelEnv), token);
  const sent = await deps.send(linkEmail(email, url, RESUME_LINK_TTL_MS / 60_000));
  if (!sent) return fail(502, 'email_failed', errors.email_failed);
  return json(202, { sent: true });
}

export type DownloadDeps = {
  readonly config: ResumeConfig | null;
  readonly now: number;
  /** Fetches the PDF from Blob; null when it isn't there. */
  readonly loadPdf: (config: ResumeConfig) => Promise<Response | null>;
  /** Runs after the response is sent (Next's `after`), for Kelvin's copy. */
  readonly later: (task: () => Promise<unknown>) => void;
  readonly send: Send;
  /** One notice per visitor per link lifetime, not one per click. */
  readonly notices: RateLimiter;
};

export function createNoticeLimiter(): RateLimiter {
  return new RateLimiter({ limit: 1, windowMs: RESUME_LINK_TTL_MS });
}

/** Where a failed link sends people: back to the form, with a reason. */
function backToForm(req: Request, reason: 'expired' | 'invalid' | 'unavailable'): Response {
  const to = new URL(`/?resume=${reason}#resume`, req.url);
  return Response.redirect(to, 303);
}

/** GET /api/resume/download/?t=… → the PDF, if the signed link is valid. */
export async function handleResumeDownload(req: Request, deps: DownloadDeps): Promise<Response> {
  const { config } = deps;
  if (!config) return backToForm(req, 'unavailable');

  const token = new URL(req.url).searchParams.get('t') ?? '';
  const result = verifyResumeToken(token, config.linkSecret, deps.now);
  if (!result.ok) {
    console.warn(`Resume download: link refused (${result.reason})`);
    return backToForm(req, result.reason === 'expired' ? 'expired' : 'invalid');
  }

  const pdf = await deps.loadPdf(config);
  if (!pdf?.ok || !pdf.body) {
    console.error(
      `Resume download: no PDF to send (Blob answered ${pdf ? pdf.status : 'nothing'})`,
    );
    return backToForm(req, 'unavailable');
  }

  const visitor = result.payload.email;
  if (deps.notices.take(visitor, deps.now)) {
    deps.later(() => deps.send(downloadNoticeEmail(config.notifyTo, visitor, new Date(deps.now))));
  }

  return new Response(pdf.body, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${RESUME_FILE_NAME}"`,
      // Never stored by a shared cache, never indexed by a search engine.
      'Cache-Control': 'private, no-store',
      'X-Robots-Tag': 'noindex, nofollow',
      'Referrer-Policy': 'no-referrer',
    },
  });
}
