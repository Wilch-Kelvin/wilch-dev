import { errorCodeFrom, requestResumeLink, returnReasonFrom } from './resume-form';

const reply = (status: number, body: unknown) =>
  vi.fn<typeof fetch>().mockResolvedValue(Response.json(body, { status }));

describe('requestResumeLink', () => {
  it('posts the email and honeypot as JSON and reports "sent"', async () => {
    const fetchImpl = reply(202, { data: { sent: true } });
    expect(await requestResumeLink(' ada@example.com ', '', fetchImpl)).toEqual({
      status: 'sent',
      email: 'ada@example.com',
    });
    const [url, init] = fetchImpl.mock.calls[0]!;
    expect(url).toBe('/api/resume/request/');
    expect(init?.method).toBe('POST');
    expect(JSON.parse(String(init?.body))).toEqual({ email: ' ada@example.com ', website: '' });
  });

  it('passes the server error code through', async () => {
    const fetchImpl = reply(429, { error: { code: 'slow_down', message: 'x' } });
    expect(await requestResumeLink('a@b.co', '', fetchImpl)).toEqual({
      status: 'error',
      code: 'slow_down',
    });
  });

  it('says "network" when the request never lands', async () => {
    const fetchImpl = vi.fn<typeof fetch>().mockRejectedValue(new TypeError('offline'));
    expect(await requestResumeLink('a@b.co', '', fetchImpl)).toEqual({
      status: 'error',
      code: 'network',
    });
  });
});

describe('errorCodeFrom', () => {
  it.each([null, 'x', {}, { error: 'x' }, { error: { code: 'made_up' } }])(
    'falls back to email_failed for %j',
    (body) => expect(errorCodeFrom(body)).toBe('email_failed'),
  );
});

describe('returnReasonFrom', () => {
  it('reads a known reason and ignores anything else', () => {
    expect(returnReasonFrom('?resume=expired')).toBe('expired');
    expect(returnReasonFrom('?resume=invalid&x=1')).toBe('invalid');
    expect(returnReasonFrom('?resume=toString')).toBeNull();
    expect(returnReasonFrom('')).toBeNull();
  });
});
