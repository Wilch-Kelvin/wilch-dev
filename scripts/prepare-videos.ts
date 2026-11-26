// Turns the raw demo recordings in assets/videos/ into small web copies:
// a silent 720p MP4 and a WebP poster per project.
// Usage (needs ffmpeg + python3 with Pillow): node scripts/prepare-videos.ts
//
// Why each step:
// - 1280 wide: the card panel is ~600 CSS px at most, so 1280 covers 2x
//   screens. With CRF 26 that cuts ~5 MB recordings to ~1 MB.
// - `-an`: the video is muted on the page anyway, so the audio is dead weight.
// - `-map_metadata -1`: drop encoder/location tags; only pixels ship.
// - `+faststart`: moves the index to the front, so playback starts before
//   the whole file arrives (matters because nothing preloads until hover).
// - The poster is the end card (logo + tagline): a calm still that reads well
//   when nothing is playing. ffmpeg here has no WebP encoder, so Pillow
//   writes it (and, like the profile photo, writes no EXIF/XMP/ICC).
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { metadataChunks, webpChunks } from './webp-meta.ts';

export const VIDEO_WIDTH = 1280;
export const VIDEO_HEIGHT = 720;
export const OUT_DIR = 'assets/videos/out';

/** Which raw recording belongs to which card, and where its end card is. */
export const SOURCES = [
  { id: 'classping', file: 'assets/videos/classping_desktop.mp4', posterAt: 19 },
  { id: 'ro5n3r', file: 'assets/videos/ro5n3r_extension.mp4', posterAt: 19 },
] as const;

const ENCODE_WEBP = `
import sys
from PIL import Image
src, dst = sys.argv[1], sys.argv[2]
with Image.open(src) as im:
    im = im.convert("RGB")
    im.save(dst, "WEBP", quality=80, method=6)
`;

function run(cmd: string, args: readonly string[]): string {
  return execFileSync(cmd, args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'inherit'] });
}

function kb(file: string): string {
  return `${(statSync(file).size / 1024).toFixed(0)} KB`;
}

// Only run when called directly, so upload-videos.ts can import the table.
if (import.meta.main) {
  const work = mkdtempSync(join(tmpdir(), 'videos-'));
  try {
    mkdirSync(OUT_DIR, { recursive: true });
    for (const { id, file, posterAt } of SOURCES) {
      const mp4 = join(OUT_DIR, `${id}-${VIDEO_WIDTH}.mp4`);
      run('ffmpeg', [
        ...['-v', 'error', '-y', '-i', file],
        ...['-an', '-map_metadata', '-1', '-map_chapters', '-1'],
        ...['-vf', `scale=${VIDEO_WIDTH}:-2`],
        ...['-c:v', 'libx264', '-profile:v', 'high', '-preset', 'slow', '-crf', '26'],
        ...['-pix_fmt', 'yuv420p', '-movflags', '+faststart', mp4],
      ]);

      // A check, not a hope: exactly one video stream, the right size, no audio.
      const streams = run('ffprobe', [
        ...['-v', 'error', '-show_entries', 'stream=codec_type,width,height'],
        ...['-of', 'csv=p=0', mp4],
      ]).trim();
      if (streams !== `video,${VIDEO_WIDTH},${VIDEO_HEIGHT}`) {
        throw new Error(`${mp4}: unexpected streams "${streams}"`);
      }

      const png = join(work, `${id}.png`);
      const webp = join(OUT_DIR, `${id}-poster.webp`);
      run('ffmpeg', [
        ...['-v', 'error', '-y', '-ss', String(posterAt), '-i', file],
        ...['-frames:v', '1', '-vf', `scale=${VIDEO_WIDTH}:-2`, png],
      ]);
      run('python3', ['-c', ENCODE_WEBP, png, webp]);
      const found = metadataChunks(webpChunks(readFileSync(webp)));
      if (found.length) throw new Error(`${webp} still has metadata chunks: ${found.join(', ')}`);

      console.log(`${mp4}  ${kb(mp4)}   ${webp}  ${kb(webp)}`);
    }
    console.log('No audio, no metadata. Next: node --env-file=.env.local scripts/upload-videos.ts');
  } finally {
    rmSync(work, { recursive: true, force: true });
  }
}
