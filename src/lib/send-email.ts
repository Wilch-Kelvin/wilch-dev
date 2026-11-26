import type { EmailMessage } from './resume-request';

// Sends one email through Resend's REST API. A plain fetch, no SDK: it's one
// POST, and `fetchImpl` lets tests check the request without sending mail.

const RESEND_URL = 'https://api.resend.com/emails';

export async function sendEmail(
  message: EmailMessage,
  opts: { readonly apiKey: string; readonly from: string },
  fetchImpl: typeof fetch = fetch,
): Promise<boolean> {
  try {
    const res = await fetchImpl(RESEND_URL, {
      method: 'POST',
      headers: { Authorization: `Bearer ${opts.apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: opts.from, ...message }),
    });
    if (!res.ok) {
      // Resend explains itself, e.g. "The wilch.dev domain is not verified".
      const body = (await res.json().catch(() => null)) as {
        name?: unknown;
        message?: unknown;
      } | null;
      const reason = [body?.name, body?.message].filter((v) => typeof v === 'string').join(': ');
      console.error(`Resend refused the email (${res.status}) ${reason.slice(0, 200)}`);
    }
    return res.ok;
  } catch (error) {
    console.error('Could not reach Resend:', error instanceof Error ? error.message : 'unknown');
    return false;
  }
}
