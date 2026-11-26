import { list } from '@vercel/blob';
import { after } from 'next/server';
import { pickLatest, RESUME_BLOB_PREFIX } from '@/lib/resume-blob';
import {
  blobStoreIdOf,
  missingResumeEnv,
  readResumeConfig,
  type ResumeConfig,
} from '@/lib/resume-config';
import { createNoticeLimiter, handleResumeDownload } from '@/lib/resume-handlers';
import { sendEmail } from '@/lib/send-email';

// GET /api/resume/download/?t=<signed token> → streams the resume PDF.
// The Blob URL is looked up here on the server and never sent to a browser.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const notices = createNoticeLimiter();

/**
 * Finds and fetches the PDF. Every way this can fail writes one log line
 * (store id and status only; the store id is public, the token never is),
 * so Vercel's runtime logs say exactly what went wrong.
 */
async function loadPdf(config: ResumeConfig): Promise<Response | null> {
  const store = blobStoreIdOf(config.blobToken);
  try {
    const { blobs } = await list({ prefix: RESUME_BLOB_PREFIX, token: config.blobToken });
    const latest = pickLatest(blobs);
    if (!latest) {
      console.error(`Resume download: no file under ${RESUME_BLOB_PREFIX} in Blob store ${store}`);
      return null;
    }
    return await fetch(latest.url, { cache: 'no-store' });
  } catch (error) {
    const reason = error instanceof Error ? error.message : 'unknown error';
    console.error(`Resume download: Blob store ${store} failed: ${reason.slice(0, 200)}`);
    return null;
  }
}

export async function GET(req: Request): Promise<Response> {
  const config = readResumeConfig(process.env);
  if (!config) {
    console.error(
      `Resume download: not configured, missing ${missingResumeEnv(process.env).join(', ')}`,
    );
  }
  return handleResumeDownload(req, {
    config,
    now: Date.now(),
    loadPdf,
    // after(): Kelvin's copy is sent once the PDF is on its way, so the
    // visitor never waits on a second email.
    later: (task) => after(task),
    notices,
    send: (message) =>
      config
        ? sendEmail(message, { apiKey: config.resendApiKey, from: config.from })
        : Promise.resolve(false),
  });
}
