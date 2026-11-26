import {
  imageFailed,
  isBlobUrl,
  photoFallbackSrc,
  photoOrigin,
  photoSrcSet,
  profilePhotoModule,
  type PhotoSource,
} from './profile-photo';

const host = 'https://abc123.public.blob.vercel-storage.com';
const sources: PhotoSource[] = [
  { url: `${host}/profile/kelvin-800.webp`, width: 800 },
  { url: `${host}/profile/kelvin-400.webp`, width: 400 },
];

describe('isBlobUrl', () => {
  it('accepts public Vercel Blob https URLs only', () => {
    expect(isBlobUrl(`${host}/profile/kelvin-800.webp`)).toBe(true);
    expect(isBlobUrl('http://abc123.public.blob.vercel-storage.com/x.webp')).toBe(false);
    expect(isBlobUrl('https://evil.example.com/public.blob.vercel-storage.com.webp')).toBe(false);
    expect(isBlobUrl('not a url')).toBe(false);
  });
});

describe('photoSrcSet / photoFallbackSrc', () => {
  it('lists sizes smallest first with width descriptors', () => {
    expect(photoSrcSet(sources)).toBe(
      `${host}/profile/kelvin-400.webp 400w, ${host}/profile/kelvin-800.webp 800w`,
    );
  });

  it('uses the largest file as the plain src', () => {
    expect(photoFallbackSrc(sources)).toBe(`${host}/profile/kelvin-800.webp`);
    expect(photoFallbackSrc([])).toBeNull();
  });
});

describe('photoOrigin', () => {
  it('returns the shared origin for the preconnect', () => {
    expect(photoOrigin({ sources })).toBe(host);
  });

  it('is null with no photo, no files, or mixed hosts', () => {
    expect(photoOrigin(null)).toBeNull();
    expect(photoOrigin({ sources: [] })).toBeNull();
    expect(
      photoOrigin({
        sources: [sources[0]!, { url: 'https://other.public.blob.vercel-storage.com/a', width: 1 }],
      }),
    ).toBeNull();
  });
});

describe('imageFailed', () => {
  it('is true only for a finished image with no pixels', () => {
    expect(imageFailed({ complete: true, naturalWidth: 0 })).toBe(true);
    expect(imageFailed({ complete: true, naturalWidth: 800 })).toBe(false);
    expect(imageFailed({ complete: false, naturalWidth: 0 })).toBe(false);
  });
});

describe('profilePhotoModule', () => {
  it('writes a typed module with the sources sorted by width', () => {
    const code = profilePhotoModule(sources);
    expect(code).toContain("import type { ProfilePhoto } from '@/lib/profile-photo';");
    expect(code.indexOf('kelvin-400')).toBeLessThan(code.indexOf('kelvin-800'));
    expect(code).toContain(`{ url: '${host}/profile/kelvin-800.webp', width: 800 },`);
  });

  it('writes null when there is nothing uploaded', () => {
    expect(profilePhotoModule([])).toContain(
      'export const profilePhoto: ProfilePhoto | null = null;',
    );
  });
});
