import { missingResumeEnv, readResumeConfig } from '@/lib/resume-config';
import { createRequestLimits, handleResumeRequest } from '@/lib/resume-handlers';
import { sendEmail } from '@/lib/send-email';

// POST /api/resume/request/ { email } → emails a 15-minute download link.
// The logic lives in lib/resume-handlers.ts; this file only plugs in the
// real environment, clock and mailer.
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Module scope, so the counts survive between requests on a warm instance.
const limits = createRequestLimits();

export async function POST(req: Request): Promise<Response> {
  const config = readResumeConfig(process.env);
  if (!config) {
    console.error(
      `Resume request: not configured, missing ${missingResumeEnv(process.env).join(', ')}`,
    );
  }
  return handleResumeRequest(req, {
    config,
    now: Date.now(),
    vercelEnv: process.env.VERCEL_ENV,
    limits,
    send: (message) =>
      config
        ? sendEmail(message, { apiKey: config.resendApiKey, from: config.from })
        : Promise.resolve(false),
  });
}
