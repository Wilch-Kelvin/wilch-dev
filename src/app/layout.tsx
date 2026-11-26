import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { Footer } from '@/components/layout/Footer';
import { SiteNav } from '@/components/layout/SiteNav';
import { SkipLink } from '@/components/layout/SkipLink';
import { ShapeSprite } from '@/components/ui/Shape';
import { MOTION_STORAGE_KEY } from '@/lib/motion';
import { safeJson, personJsonLd } from '@/lib/seo';
import { themeInitScript } from '@/lib/theme';
import { SITE_ORIGIN } from '@/lib/url';
import { contact, meta, person } from '@/content/site';
import { colors } from '@/theme/colors';
import { barlow, code } from '@/theme/fonts';
import { tokensCss } from '@/theme/tokens-css';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  title: { default: meta.title, template: `%s | ${person.fullName}` },
  description: meta.description,
  applicationName: person.fullName,
  authors: [{ name: person.fullName, url: SITE_ORIGIN }],
  creator: person.fullName,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'profile',
    url: '/',
    siteName: person.fullName,
    title: meta.title,
    description: meta.description,
    locale: 'en_US',
    firstName: person.firstName,
    lastName: 'Wilch',
  },
  twitter: { card: 'summary_large_image', title: meta.title, description: meta.description },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: colors.light.surface },
    { media: '(prefers-color-scheme: dark)', color: colors.dark.surface },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    // suppressHydrationWarning: the pre-paint script adds data-theme / data-motion
    // to <html> before React loads, which is expected, not a bug.
    <html lang="en" className={`${barlow.variable} ${code.variable}`} suppressHydrationWarning>
      <head>
        <style id="tokens" dangerouslySetInnerHTML={{ __html: tokensCss() }} />
        <script dangerouslySetInnerHTML={{ __html: themeInitScript(MOTION_STORAGE_KEY) }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: safeJson(
              personJsonLd({
                name: person.fullName,
                jobTitle: person.role,
                school: person.school,
                sameAs: [contact.github.href, contact.linkedin.href],
              }),
            ),
          }}
        />
      </head>
      <body id="top">
        <ShapeSprite />
        <SkipLink />
        <SiteNav />
        {children}
        <Footer />
      </body>
    </html>
  );
}
