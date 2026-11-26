import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { Footer } from '@/components/layout/Footer';
import { SiteNav } from '@/components/layout/SiteNav';
import { SkipLink } from '@/components/layout/SkipLink';
import { ShapeSprite } from '@/components/ui/Shape';
import { MOTION_STORAGE_KEY } from '@/lib/motion';
import { themeInitScript } from '@/lib/theme';
import { barlow, code } from '@/theme/fonts';
import { tokensCss } from '@/theme/tokens-css';
import './globals.css';

export const metadata: Metadata = {
  title: 'Kelvin Wilch',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FBF8FF' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
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
