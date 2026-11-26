// Uploads the prepared demo videos and posters to Vercel Blob and writes
// their public URLs into src/content/project-videos.ts.
//
// Usage:
//   node scripts/prepare-videos.ts                       # make the web copies
//   node --env-file=.env.local scripts/upload-videos.ts
//
// The token only ever comes from the environment (.env* is gitignored). The
// site never needs it: the uploaded files are public, read-only URLs.
import { put } from '@vercel/blob';
import { readFileSync, writeFileSync } from 'node:fs';
import { isBlobUrl } from '../src/lib/profile-photo.ts';
import { projectVideosModule, type BlobUrl, type ProjectVideo } from '../src/lib/project-video.ts';
import { OUT_DIR, SOURCES, VIDEO_HEIGHT, VIDEO_WIDTH } from './prepare-videos.ts';

const CONTENT_FILE = 'src/content/project-videos.ts';

if (!process.env.BLOB_READ_WRITE_TOKEN) {
  console.error(
    'BLOB_READ_WRITE_TOKEN is not set. Run `vercel env pull .env.local`, then ' +
      '`node --env-file=.env.local scripts/upload-videos.ts`.',
  );
  process.exit(1);
}

async function upload(file: string, pathname: string, contentType: string): Promise<BlobUrl> {
  const blob = await put(pathname, readFileSync(file), {
    access: 'public',
    contentType,
    // Stable pathname: re-running replaces the file instead of adding a
    // random suffix, so the URL in content never goes stale.
    addRandomSuffix: false,
    allowOverwrite: true,
    cacheControlMaxAge: 60 * 60 * 24 * 30,
  });
  if (!isBlobUrl(blob.url)) throw new Error(`Unexpected Blob URL: ${blob.url}`);
  console.log(`Uploaded ${file} → ${blob.url}`);
  return blob.url as BlobUrl;
}

const videos: Record<string, ProjectVideo> = {};
for (const { id } of SOURCES) {
  const name = `${id}-${VIDEO_WIDTH}.mp4`;
  videos[id] = {
    src: await upload(`${OUT_DIR}/${name}`, `projects/${name}`, 'video/mp4'),
    poster: await upload(
      `${OUT_DIR}/${id}-poster.webp`,
      `projects/${id}-poster.webp`,
      'image/webp',
    ),
    width: VIDEO_WIDTH,
    height: VIDEO_HEIGHT,
  };
}

writeFileSync(CONTENT_FILE, projectVideosModule(videos));
console.log(`Wrote ${CONTENT_FILE}. Rebuild to see the videos.`);
