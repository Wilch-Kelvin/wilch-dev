import { randomBytes } from 'node:crypto';

// Where the resume PDF lives in Vercel Blob. The store is a public one (the
// demo videos share it), and a public blob is readable by anyone who knows
// its URL. So the folder name is 128 random bits: nobody can guess it, the
// URL is never sent to a browser, and only the server finds it, by listing
// this prefix with the store token. Visitors only ever get the signed link.
export const RESUME_BLOB_PREFIX = 'resume/';

/** The file name visitors see when the download lands. */
export const RESUME_FILE_NAME = 'Kelvin-Wilch-Resume.pdf';

/** A fresh unguessable pathname, e.g. resume/3f9c…/Kelvin-Wilch-Resume.pdf */
export function newResumePathname(random: Buffer = randomBytes(16)): string {
  return `${RESUME_BLOB_PREFIX}${random.toString('hex')}/${RESUME_FILE_NAME}`;
}

/** The newest upload wins, so a re-upload takes over straight away. */
export function pickLatest<T extends { uploadedAt: Date }>(blobs: readonly T[]): T | null {
  return blobs.reduce<T | null>(
    (latest, blob) => (!latest || blob.uploadedAt > latest.uploadedAt ? blob : latest),
    null,
  );
}
