// Uploads Kelvin's resume PDF to Vercel Blob under a fresh, unguessable path
// (see src/lib/resume-blob.ts), then deletes any older copies. Re-run it
// whenever the resume changes: the old path stops working at the same time,
// so a URL that ever leaked goes dead too.
//
// Usage:
//   node --env-file=.env.local scripts/upload-resume.ts [path/to/resume.pdf]
//
// The PDF itself stays out of git (docs/ is gitignored); the repo is public.
import { del, list, put } from '@vercel/blob';
import { readFileSync } from 'node:fs';
import { newResumePathname, RESUME_BLOB_PREFIX } from '../src/lib/resume-blob.ts';

const file = process.argv[2] ?? 'docs/KelvinsMasterResume.pdf';

if (!process.env.BLOB_READ_WRITE_TOKEN) {
  console.error(
    'BLOB_READ_WRITE_TOKEN is not set. Run `node --env-file=.env.local scripts/upload-resume.ts`.',
  );
  process.exit(1);
}

const { blobs: old } = await list({ prefix: RESUME_BLOB_PREFIX });

await put(newResumePathname(), readFileSync(file), {
  access: 'public',
  contentType: 'application/pdf',
  addRandomSuffix: false,
});
// Never print the URL: it is the one thing that must stay secret.
console.log(`Uploaded ${file} to a new random path under ${RESUME_BLOB_PREFIX}`);

if (old.length > 0) {
  await del(old.map((b) => b.url));
  console.log(`Deleted ${old.length} older cop${old.length === 1 ? 'y' : 'ies'}.`);
}
