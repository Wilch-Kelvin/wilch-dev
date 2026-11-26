// @vitest-environment node
import type { ResumeConfig } from './resume-config';
import {
  createNoticeLimiter,
  createRequestLimits,
  handleResumeDownload,
  handleResumeRequest,
  type DownloadDeps,
  type RequestDeps,
} from './resume-handlers';
import type { EmailMessage } from './resume-request';
import { createResumeToken, RESUME_LINK_TTL_MS } from './resume-token';

const config: ResumeConfig = {
  resendApiKey: 're_test',
  from: 'Kelvin <resume@wilch.dev>',
  notifyTo: 'kelvin@example.com',
  linkSecret: 's'.repeat(40),
  blobToken: 'blob',
};
const now = 1_800_000_000_000;

const post = (body: unknown, ip = '1.1.1.1') =>
  new Request('https://wilch.dev/api/resume/request/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-forwarded-for': ip },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });

function requestDeps(overrides: Partial<RequestDeps> = {}) {
  const sent: EmailMessage[] = [];
  const deps: RequestDeps = {
    config,
    now,
    vercelEnv: 'production',
    limits: createRequestLimits(),
    send: async (m) => (sent.push(m), true),
    ...overrides,
  };
  return { deps, sent };
}

describe('POST /api/resume/request', () => {
  it('emails a signed wilch.dev link to the visitor (202)', async () => {
    const { deps, sent } = requestDeps();
    const res = await handleResumeRequest(post({ email: 'Ada@Example.com' }), deps);
    expect(res.status).toBe(202);
    expect(await res.json()).toEqual({ data: { sent: true } });
    expect(sent).toHaveLength(1);
    expect(sent[0]!.to).toBe('ada@example.com');
    expect(sent[0]!.text).toMatch(/https:\/\/wilch\.dev\/api\/resume\/download\/\?t=\S+/);
  });

  it('400s on a bad email and sends nothing', async () => {
    const { deps, sent } = requestDeps();
    for (const body of [{ email: 'nope' }, '{not json', {}]) {
      const res = await handleResumeRequest(post(body), deps);
      expect(res.status).toBe(400);
      expect(await res.json()).toMatchObject({ error: { code: 'invalid_email' } });
    }
    expect(sent).toHaveLength(0);
  });

  it('answers a filled honeypot like a success but sends nothing', async () => {
    const { deps, sent } = requestDeps();
    const res = await handleResumeRequest(post({ email: 'a@b.co', website: 'spam' }), deps);
    expect(res.status).toBe(202);
    expect(sent).toHaveLength(0);
  });

  it('429s once one address has had 3 links in an hour', async () => {
    const { deps, sent } = requestDeps();
    const statuses = [];
    for (let i = 0; i < 4; i++) {
      statuses.push(
        (await handleResumeRequest(post({ email: 'a@b.co' }, `9.9.9.${i}`), deps)).status,
      );
    }
    expect(statuses).toEqual([202, 202, 202, 429]);
    expect(sent).toHaveLength(3);
  });

  it('429s once one IP has asked 5 times, whatever the address', async () => {
    const { deps } = requestDeps();
    const statuses = [];
    for (let i = 0; i < 6; i++) {
      statuses.push((await handleResumeRequest(post({ email: `a${i}@b.co` }), deps)).status);
    }
    expect(statuses.at(-1)).toBe(429);
  });

  it('502s when the email provider fails, 503s when not configured', async () => {
    const failing = requestDeps({ send: async () => false });
    expect((await handleResumeRequest(post({ email: 'a@b.co' }), failing.deps)).status).toBe(502);
    const off = requestDeps({ config: null });
    expect((await handleResumeRequest(post({ email: 'a@b.co' }), off.deps)).status).toBe(503);
  });
});

describe('GET /api/resume/download', () => {
  const get = (token: string) =>
    new Request(`https://wilch.dev/api/resume/download/?t=${encodeURIComponent(token)}`);
  const pdf = () => new Response('%PDF-1.7', { headers: { 'Content-Type': 'application/pdf' } });

  function downloadDeps(overrides: Partial<DownloadDeps> = {}) {
    const sent: EmailMessage[] = [];
    const tasks: (() => Promise<unknown>)[] = [];
    const deps: DownloadDeps = {
      config,
      now,
      loadPdf: async () => pdf(),
      later: (task) => tasks.push(task),
      send: async (m) => (sent.push(m), true),
      notices: createNoticeLimiter(),
      ...overrides,
    };
    return { deps, sent, tasks };
  }

  it('streams the PDF as a private, uncached attachment', async () => {
    const { deps } = downloadDeps();
    const res = await handleResumeDownload(
      get(createResumeToken('a@b.co', config.linkSecret, now)),
      deps,
    );
    expect(res.status).toBe(200);
    expect(res.headers.get('Content-Type')).toBe('application/pdf');
    expect(res.headers.get('Content-Disposition')).toBe(
      'attachment; filename="Kelvin-Wilch-Resume.pdf"',
    );
    expect(res.headers.get('Cache-Control')).toBe('private, no-store');
    expect(await res.text()).toBe('%PDF-1.7');
  });

  it('sends Kelvin one copy per visitor per link, after the response', async () => {
    const { deps, sent, tasks } = downloadDeps();
    const token = createResumeToken('a@b.co', config.linkSecret, now);
    await handleResumeDownload(get(token), deps);
    await handleResumeDownload(get(token), deps);
    expect(sent).toHaveLength(0); // nothing yet: it waits for after()
    await Promise.all(tasks.map((t) => t()));
    expect(sent).toHaveLength(1);
    expect(sent[0]).toMatchObject({
      to: 'kelvin@example.com',
      subject: 'Resume downloaded by a@b.co',
    });
  });

  it('sends expired and forged links back to the form', async () => {
    const { deps, tasks } = downloadDeps();
    const old = createResumeToken('a@b.co', config.linkSecret, now - RESUME_LINK_TTL_MS);
    const expired = await handleResumeDownload(get(old), deps);
    expect(expired.status).toBe(303);
    expect(expired.headers.get('Location')).toBe('https://wilch.dev/?resume=expired#resume');

    const forged = createResumeToken('a@b.co', 'z'.repeat(40), now);
    const bad = await handleResumeDownload(get(forged), deps);
    expect(bad.headers.get('Location')).toBe('https://wilch.dev/?resume=invalid#resume');
    expect((await handleResumeDownload(get(''), deps)).headers.get('Location')).toContain(
      'resume=invalid',
    );
    expect(tasks).toHaveLength(0);
  });

  it('says "unavailable" when the PDF is missing or the gate is off', async () => {
    const token = createResumeToken('a@b.co', config.linkSecret, now);
    const missing = downloadDeps({ loadPdf: async () => null });
    expect(
      (await handleResumeDownload(get(token), missing.deps)).headers.get('Location'),
    ).toContain('resume=unavailable');
    const off = downloadDeps({ config: null });
    expect((await handleResumeDownload(get(token), off.deps)).headers.get('Location')).toContain(
      'resume=unavailable',
    );
  });
});
