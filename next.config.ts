import type { NextConfig } from 'next';

// Every page is still prerendered to plain HTML at build time (fast and
// cheap). Static export is off since 2026-11-26 only so Vercel can also run
// the two resume API routes (src/app/api/resume); nothing else uses a server.
const nextConfig: NextConfig = {
  // Directory-style URLs (/projects/), kept from the static-export days so
  // no existing link changes.
  trailingSlash: true,
  // Images are already sized WebP on Vercel Blob, so no optimiser needed.
  images: { unoptimized: true },
  reactStrictMode: true,
  poweredByHeader: false,
};

export default nextConfig;
