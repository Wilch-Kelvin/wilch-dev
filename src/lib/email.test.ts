import { assembleEmail, mailtoHref } from './email';

describe('email', () => {
  const parts = { user: 'someone', domain: 'example.com' };

  it('joins the parts', () => {
    expect(assembleEmail(parts)).toBe('someone@example.com');
  });

  it('builds a mailto link, encoding the subject', () => {
    expect(mailtoHref(parts)).toBe('mailto:someone@example.com');
    expect(mailtoHref(parts, 'Hi & hello')).toBe(
      'mailto:someone@example.com?subject=Hi%20%26%20hello',
    );
  });

  it('refuses incomplete parts', () => {
    expect(() => assembleEmail({ user: '', domain: 'example.com' })).toThrow();
    expect(() => assembleEmail({ user: 'a', domain: 'localhost' })).toThrow();
  });
});
