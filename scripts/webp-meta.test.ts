import { metadataChunks, webpChunks } from './webp-meta';

/** Builds a minimal RIFF/WebP byte array from chunk ids and payload sizes. */
function fakeWebp(chunks: readonly [string, number][]): Uint8Array {
  const body = chunks.flatMap(([id, size]) => {
    const header = [...id].map((c) => c.charCodeAt(0));
    const len = [size & 0xff, (size >> 8) & 0xff, (size >> 16) & 0xff, size >>> 24];
    return [...header, ...len, ...new Array<number>(size + (size % 2)).fill(0)];
  });
  const total = 4 + body.length;
  const riffLen = [total & 0xff, (total >> 8) & 0xff, (total >> 16) & 0xff, total >>> 24];
  const ascii = (s: string) => [...s].map((c) => c.charCodeAt(0));
  return new Uint8Array([...ascii('RIFF'), ...riffLen, ...ascii('WEBP'), ...body]);
}

describe('webpChunks', () => {
  it('lists every chunk, including odd-sized (padded) ones', () => {
    expect(webpChunks(fakeWebp([['VP8X', 10], ['ICCP', 3], ['VP8 ', 20], ['EXIF', 7]]))).toEqual([
      'VP8X',
      'ICCP',
      'VP8 ',
      'EXIF',
    ]);
  });

  it('rejects files that are not WebP', () => {
    expect(() => webpChunks(new Uint8Array([1, 2, 3]))).toThrow('Not a WebP file');
  });
});

describe('metadataChunks', () => {
  it('flags EXIF, XMP and ICC profile chunks only', () => {
    expect(metadataChunks(['VP8X', 'ICCP', 'VP8 ', 'EXIF', 'XMP '])).toEqual(['ICCP', 'EXIF', 'XMP ']);
    expect(metadataChunks(['VP8 '])).toEqual([]);
  });
});
