import type { MetadataRoute } from 'next';
import { absoluteUrl } from '@/lib/url';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: absoluteUrl('/'), changeFrequency: 'monthly', priority: 1 }];
}
