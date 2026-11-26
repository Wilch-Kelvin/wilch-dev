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

const NAMES = {
  resendApiKey: 'RESEND_API_KEY',
  from: 'RESUME_FROM_EMAIL',
  notifyTo: 'RESUME_NOTIFY_EMAIL',
  linkSecret: 'RESUME_LINK_SECRET',
  blobToken: 'BLOB_READ_WRITE_TOKEN',
} as const satisfies Record<keyof ResumeConfig, string>;

const valueOf = (env: Env, name: string) => env[name]?.trim() ?? '';

/**
 * Names (never values) of settings that are missing or unusable, so the
 * server logs can say exactly what to fix in Vercel.
 */
export function missingResumeEnv(env: Env): string[] {
  return Object.values(NAMES).filter((name) => {
    const value = valueOf(env, name);
    return name === NAMES.linkSecret ? value.length < 32 : !value;
  });
}

/** The config, or null if anything is missing (the site then hides the form). */
export function readResumeConfig(env: Env): ResumeConfig | null {
  if (missingResumeEnv(env).length > 0) return null;
  return {
    resendApiKey: valueOf(env, NAMES.resendApiKey),
    from: valueOf(env, NAMES.from),
    notifyTo: valueOf(env, NAMES.notifyTo),
    linkSecret: valueOf(env, NAMES.linkSecret),
    blobToken: valueOf(env, NAMES.blobToken),
  };
}

/** The store id inside a Blob token. Not a secret: it is in every public Blob URL. */
export function blobStoreIdOf(token: string): string {
  return token.split('_')[3] ?? 'unknown';
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
