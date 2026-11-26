import type { NextConfig } from 'next';

// Static export: a portfolio has no server data, so every page is plain HTML
// built ahead of time. That is the fastest and cheapest thing to host.
const nextConfig: NextConfig = {
  output: 'export',
  // Directory-style URLs (/404/index.html) so any static host serves them.
  trailingSlash: true,
  // The static export has no image optimiser server, so images ship as-is.
  images: { unoptimized: true },
  reactStrictMode: true,
  poweredByHeader: false,
};

export default nextConfig;
