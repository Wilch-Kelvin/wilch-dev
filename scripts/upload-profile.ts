// Uploads the prepared portrait WebPs to Vercel Blob and writes their public
// URLs into src/content/profile-photo.ts.
//
// Usage:
//   node scripts/prepare-profile.ts            # make + check the WebPs first
//   BLOB_READ_WRITE_TOKEN=… node scripts/upload-profile.ts
// or, after `vercel link` + `vercel env pull .env.local`:
//   node --env-file=.env.local scripts/upload-profile.ts
//
// The token only ever comes from the environment. It is never written to a
// file in the repo (.env* is gitignored), and the site itself never needs it:
// the uploaded files are public, read-only URLs.
import { put } from '@vercel/blob';
import { readFileSync, writeFileSync } from 'node:fs';
import { metadataChunks, webpChunks } from './webp-meta.ts';
import { isBlobUrl, profilePhotoModule, type PhotoSource } from '../src/lib/profile-photo.ts';

const WIDTHS = [400, 800] as const;
const CONTENT_FILE = 'src/content/profile-photo.ts';

if (!process.env.BLOB_READ_WRITE_TOKEN) {
  console.error(
    'BLOB_READ_WRITE_TOKEN is not set. Create a Blob store in the Vercel dashboard ' +
      '(Storage → Blob), connect it to this project, then run `vercel env pull .env.local` ' +
      'and `node --env-file=.env.local scripts/upload-profile.ts`.',
  );
  process.exit(1);
}

const sources: PhotoSource[] = [];
for (const width of WIDTHS) {
  const file = `assets/profile/out/kelvin-${width}.webp`;
  const bytes = readFileSync(file);
  // Belt and braces: refuse to publish anything that still carries metadata.
  const found = metadataChunks(webpChunks(bytes));
  if (found.length) throw new Error(`${file} has metadata (${found.join(', ')}); not uploading`);

  const blob = await put(`profile/kelvin-${width}.webp`, bytes, {
    access: 'public',
    contentType: 'image/webp',
    // A stable pathname: re-running replaces the file instead of adding
    // a random suffix, so the URL in content never goes stale.
    addRandomSuffix: false,
    allowOverwrite: true,
    cacheControlMaxAge: 60 * 60 * 24 * 30,
  });
  if (!isBlobUrl(blob.url)) throw new Error(`Unexpected Blob URL: ${blob.url}`);
  sources.push({ url: blob.url as PhotoSource['url'], width });
  console.log(`Uploaded ${file} → ${blob.url}`);
}

writeFileSync(CONTENT_FILE, profilePhotoModule(sources));
console.log(`Wrote ${CONTENT_FILE}. Rebuild to see the photo.`);
