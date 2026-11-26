// The address is stored in two parts (no "@") and only joined in the browser,
// which stops the simplest scrapers. These are the pure pieces of that.

export type EmailParts = { user: string; domain: string };

export function assembleEmail({ user, domain }: EmailParts): string {
  if (!user || !domain.includes('.')) throw new Error('Incomplete email parts');
  return `${user}@${domain}`;
}

export function mailtoHref(parts: EmailParts, subject?: string): `mailto:${string}` {
  const address = assembleEmail(parts);
  return subject ? `mailto:${address}?subject=${encodeURIComponent(subject)}` : `mailto:${address}`;
}
