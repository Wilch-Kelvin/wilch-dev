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
    if (!res.ok) console.error(`Resend refused the email (${res.status})`);
    return res.ok;
  } catch {
    console.error('Could not reach Resend');
    return false;
  }
}
