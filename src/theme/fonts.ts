import { Barlow_Condensed, Google_Sans_Code } from 'next/font/google';

// next/font downloads the files at build time and serves them from wilch.dev,
// so there is no request to Google, no layout shift (it generates a
// size-matched fallback) and no render-blocking <link>.
//
// Kelvin asked for every Barlow Condensed weight and italic. They are all
// declared, but the browser only downloads the faces the page actually uses,
// so `preload` stays off to avoid preloading 18 files.
export const barlow = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
  display: 'swap',
  preload: false,
  variable: '--font-barlow',
  fallback: ['Arial Narrow', 'system-ui', 'sans-serif'],
});

// Monospace for code, labels and the demos (from the original design).
export const code = Google_Sans_Code({
  subsets: ['latin'],
  display: 'swap',
  preload: false,
  variable: '--font-code',
  fallback: ['ui-monospace', 'Menlo', 'monospace'],
});
