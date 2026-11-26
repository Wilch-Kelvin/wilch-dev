import { SITE_ORIGIN } from './url';

// Everything the resume gate needs from the environment, read in one place.
// Secrets only ever come from process.env (set in Vercel → Settings →
// Environment Variables, or .env.local) and never reach the browser: these
// names have no NEXT_PUBLIC_ prefix, so Next.js refuses to bundle them.

export type ResumeConfig = {
  /** Resend API key (resend.com → API Keys). */
  readonly resendApiKey: string;
  /** Who the emails come from, e.g. "Kelvin Wilch <resume@wilch.dev>". */
  readonly from: string;
  /** Where Kelvin's "someone downloaded it" copy goes. */
  readonly notifyTo: string;
  /** Signs the download links. 32+ random characters. */
  readonly linkSecret: string;
  /** Vercel Blob token, used to find the PDF. */
  readonly blobToken: string;
};

type Env = Readonly<Record<string, string | undefined>>;

/** The config, or null if anything is missing (the site then hides the form). */
export function readResumeConfig(env: Env): ResumeConfig | null {
  const config = {
    resendApiKey: env.RESEND_API_KEY?.trim() ?? '',
    from: env.RESUME_FROM_EMAIL?.trim() ?? '',
    notifyTo: env.RESUME_NOTIFY_EMAIL?.trim() ?? '',
    linkSecret: env.RESUME_LINK_SECRET?.trim() ?? '',
    blobToken: env.BLOB_READ_WRITE_TOKEN?.trim() ?? '',
  };
  const complete = Object.values(config).every(Boolean) && config.linkSecret.length >= 32;
  return complete ? config : null;
}

/**
 * The visitor's IP for rate limiting. On Vercel, x-forwarded-for is written
 * by Vercel's edge (a client can't fake the first entry), so it's safe here.
 */
export function clientIp(headers: Headers): string {
  const forwarded = headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  return forwarded || headers.get('x-real-ip')?.trim() || 'unknown';
}

/**
 * Where emailed links point. Production always uses wilch.dev, so a forged
 * Host header can never make us email a link to someone else's site.
 * Previews and local dev use their own address so the flow can be tried.
 */
export function linkOrigin(requestUrl: string, vercelEnv: string | undefined): string {
  return vercelEnv === 'production' ? SITE_ORIGIN : new URL(requestUrl).origin;
}
