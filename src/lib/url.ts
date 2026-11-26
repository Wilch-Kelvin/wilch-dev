// One place for the production origin, so metadata, sitemap and OG tags agree.
export const SITE_ORIGIN = 'https://wilch.dev';

/** Turns a site path ("/", "/resume.pdf") into an absolute wilch.dev URL. */
export function absoluteUrl(path: string): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  return new URL(clean, SITE_ORIGIN).toString();
}
