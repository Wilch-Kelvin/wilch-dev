// Reads the chunk list of a WebP file so we can prove it carries no metadata.
// A WebP is a RIFF container: "RIFF" <size> "WEBP", then chunks of
// <4-char id><little-endian size><data, padded to even length>. Location,
// camera and colour-profile data can only live in EXIF, XMP or ICCP chunks,
// so "none of those present" means "no metadata".

export const METADATA_CHUNKS = ['EXIF', 'XMP ', 'ICCP'] as const;

export function webpChunks(bytes: Uint8Array): string[] {
  const ascii = (from: number) => String.fromCharCode(...bytes.subarray(from, from + 4));
  if (bytes.length < 12 || ascii(0) !== 'RIFF' || ascii(8) !== 'WEBP') {
    throw new Error('Not a WebP file');
  }
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const chunks: string[] = [];
  let offset = 12;
  while (offset + 8 <= bytes.length) {
    chunks.push(ascii(offset));
    const size = view.getUint32(offset + 4, true);
    offset += 8 + size + (size % 2);
  }
  return chunks;
}

export function metadataChunks(chunks: readonly string[]): string[] {
  return chunks.filter((id) => (METADATA_CHUNKS as readonly string[]).includes(id));
}
