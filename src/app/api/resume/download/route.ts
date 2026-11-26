import { list } from '@vercel/blob';
import { after } from 'next/server';
import { pickLatest, RESUME_BLOB_PREFIX } from '@/lib/resume-blob';
import { readResumeConfig, type ResumeConfig } from '@/lib/resume-config';
import { createNoticeLimiter, handleResumeDownload } from '@/lib/resume-handlers';
import { sendEmail } from '@/lib/send-email';

// GET /api/resume/download/?t=<signed token> → streams the resume PDF.
// The Blob URL is looked up here on the server and never sent to a browser.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const notices = createNoticeLimiter();

async function loadPdf(config: ResumeConfig): Promise<Response | null> {
  const { blobs } = await list({ prefix: RESUME_BLOB_PREFIX, token: config.blobToken });
  const latest = pickLatest(blobs);
  return latest ? fetch(latest.url, { cache: 'no-store' }) : null;
}

export async function GET(req: Request): Promise<Response> {
  const config = readResumeConfig(process.env);
  return handleResumeDownload(req, {
    config,
    now: Date.now(),
    loadPdf: (c) => loadPdf(c).catch(() => null),
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
