// Turns the iPhone HEIC in assets/profile/ into small, metadata-free WebPs.
// Usage (macOS): node scripts/prepare-profile.ts
//
// Why each step:
// - `sips` (built into macOS) is the one tool here that decodes HEIC. It
//   converts to sRGB first, so dropping the colour profile later can't shift
//   the colours (browsers assume sRGB for untagged images).
// - The crop is a square around the face, so the round cookie frame shows a
//   face, not a ceiling.
// - Pillow (python3) writes the WebP. It only writes EXIF/XMP/ICC if asked,
//   and we never ask, so GPS and camera data cannot survive.
// - Finally we read every output's RIFF chunks and fail if any metadata
//   chunk is present: a check, not a hope.
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { metadataChunks, webpChunks } from './webp-meta.ts';

const SOURCE = 'assets/profile/profilepic.heic';
const OUT_DIR = 'assets/profile/out';
// Square crop (source is 1280×1280): face sits a little below the middle.
const CROP = { size: 960, top: 300, left: 160 };
const WIDTHS = [800, 400] as const;
const SRGB = '/System/Library/ColorSync/Profiles/sRGB Profile.icc';

const ENCODE_WEBP = `
import sys
from PIL import Image
src, dst = sys.argv[1], sys.argv[2]
with Image.open(src) as im:
    im = im.convert("RGB")
    # No exif=, xmp= or icc_profile= arguments: nothing but pixels is written.
    im.save(dst, "WEBP", quality=82, method=6)
`;

function run(cmd: string, args: readonly string[]) {
  execFileSync(cmd, args, { stdio: ['ignore', 'ignore', 'inherit'] });
}

const work = mkdtempSync(join(tmpdir(), 'profile-'));
try {
  mkdirSync(OUT_DIR, { recursive: true });
  const square = join(work, 'square.png');
  run('sips', ['-s', 'format', 'png', '--matchTo', SRGB, SOURCE, '--out', square]);
  run('sips', ['-c', String(CROP.size), String(CROP.size), '--cropOffset', String(CROP.top), String(CROP.left), square]);

  for (const width of WIDTHS) {
    const png = join(work, `${width}.png`);
    const webp = join(OUT_DIR, `kelvin-${width}.webp`);
    run('sips', ['-Z', String(width), square, '--out', png]);
    run('python3', ['-c', ENCODE_WEBP, png, webp]);

    const bytes = readFileSync(webp);
    const chunks = webpChunks(bytes);
    const found = metadataChunks(chunks);
    if (found.length) throw new Error(`${webp} still has metadata chunks: ${found.join(', ')}`);
    console.log(`${webp}  ${(bytes.length / 1024).toFixed(1)} KB  chunks: ${chunks.join(' ')}`);
  }
  console.log('No EXIF, XMP or ICC chunks in any output.');
} finally {
  rmSync(work, { recursive: true, force: true });
}
