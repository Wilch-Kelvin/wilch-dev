import { resumeGate, type ResumeErrorCode, type ResumeReturnReason } from '@/content/resume';

// Browser side of the resume gate: the form's states, the typed call to the
// API and reading why someone came back from a link. No React in here, so it
// is all unit-tested directly.

export type ResumeFormState =
  | { readonly status: 'idle' }
  | { readonly status: 'sending' }
  | { readonly status: 'sent'; readonly email: string }
  | { readonly status: 'error'; readonly code: ResumeErrorCode };

/** trailingSlash is on, so the route lives at the path with "/" on the end. */
export const RESUME_REQUEST_PATH = '/api/resume/request/';

const isErrorCode = (code: unknown): code is ResumeErrorCode =>
  typeof code === 'string' && Object.hasOwn(resumeGate.errors, code);

/** Reads `{ error: { code } }`; anything unexpected counts as a send failure. */
export function errorCodeFrom(body: unknown): ResumeErrorCode {
  if (typeof body === 'object' && body !== null && 'error' in body) {
    const { error } = body as { error: unknown };
    if (typeof error === 'object' && error !== null && 'code' in error) {
      const { code } = error as { code: unknown };
      if (isErrorCode(code)) return code;
    }
  }
  return 'email_failed';
}

/** Asks the server to email a download link. Never throws. */
export async function requestResumeLink(
  email: string,
  website: string,
  fetchImpl: typeof fetch = fetch,
): Promise<ResumeFormState> {
  try {
    const res = await fetchImpl(RESUME_REQUEST_PATH, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, website }),
    });
    if (res.ok) return { status: 'sent', email: email.trim() };
    return { status: 'error', code: errorCodeFrom(await res.json().catch(() => null)) };
  } catch {
    return { status: 'error', code: 'network' };
  }
}

/** `?resume=expired` etc., set by the download route when a link fails. */
export function returnReasonFrom(search: string): ResumeReturnReason | null {
  const reason = new URLSearchParams(search).get('resume');
  return reason && Object.hasOwn(resumeGate.returned, reason)
    ? (reason as ResumeReturnReason)
    : null;
}
