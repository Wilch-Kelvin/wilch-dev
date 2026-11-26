import {
  blobStoreIdOf,
  clientIp,
  linkOrigin,
  missingResumeEnv,
  readResumeConfig,
} from './resume-config';

const full = {
  RESEND_API_KEY: 're_test',
  RESUME_FROM_EMAIL: 'Kelvin <resume@wilch.dev>',
  RESUME_NOTIFY_EMAIL: 'me@example.com',
  RESUME_LINK_SECRET: 's'.repeat(32),
  BLOB_READ_WRITE_TOKEN: 'vercel_blob_rw_x',
};

describe('readResumeConfig', () => {
  it('returns the config when everything is set', () => {
    expect(readResumeConfig(full)).toEqual({
      resendApiKey: 're_test',
      from: 'Kelvin <resume@wilch.dev>',
      notifyTo: 'me@example.com',
      linkSecret: 's'.repeat(32),
      blobToken: 'vercel_blob_rw_x',
    });
  });

  it.each(Object.keys(full))('is null when %s is missing', (key) => {
    expect(readResumeConfig({ ...full, [key]: undefined })).toBeNull();
    expect(readResumeConfig({ ...full, [key]: '  ' })).toBeNull();
  });

  it('is null when the link secret is too short to be safe', () => {
    expect(readResumeConfig({ ...full, RESUME_LINK_SECRET: 'short' })).toBeNull();
  });
});

describe('clientIp', () => {
  it('takes the first forwarded address, then x-real-ip, then "unknown"', () => {
    expect(clientIp(new Headers({ 'x-forwarded-for': '1.2.3.4, 10.0.0.1' }))).toBe('1.2.3.4');
    expect(clientIp(new Headers({ 'x-real-ip': '5.6.7.8' }))).toBe('5.6.7.8');
    expect(clientIp(new Headers())).toBe('unknown');
  });
});

describe('linkOrigin', () => {
  it('always uses wilch.dev in production, whatever the request says', () => {
    expect(linkOrigin('https://evil.example/api', 'production')).toBe('https://wilch.dev');
  });

  it('uses the request origin on previews and locally', () => {
    expect(linkOrigin('http://localhost:3000/api/x', undefined)).toBe('http://localhost:3000');
    expect(linkOrigin('https://p.vercel.app/api/x', 'preview')).toBe('https://p.vercel.app');
  });
});

describe('missingResumeEnv', () => {
  it('names (never values) what is missing or too short', () => {
    expect(missingResumeEnv(full)).toEqual([]);
    expect(missingResumeEnv({ ...full, RESEND_API_KEY: ' ', RESUME_LINK_SECRET: 'short' })).toEqual(
      ['RESEND_API_KEY', 'RESUME_LINK_SECRET'],
    );
  });
});

describe('blobStoreIdOf', () => {
  it('reads the public store id out of a read-write token', () => {
    expect(blobStoreIdOf('vercel_blob_rw_AbC123_secretpart')).toBe('AbC123');
    expect(blobStoreIdOf('junk')).toBe('unknown');
  });
});
