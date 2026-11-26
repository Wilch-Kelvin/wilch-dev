import { projectVideosModule, shouldPlayVideo, type PlaybackState } from './project-video';

const desktop: PlaybackState = {
  engaged: false,
  inView: false,
  canHover: true,
  reducedMotion: false,
  paused: false,
};

describe('shouldPlayVideo', () => {
  it('plays on hover with a mouse, and only then', () => {
    expect(shouldPlayVideo(desktop)).toBe(false);
    expect(shouldPlayVideo({ ...desktop, engaged: true })).toBe(true);
    // Being on screen alone does not start it on a hover device.
    expect(shouldPlayVideo({ ...desktop, inView: true })).toBe(false);
  });

  it('plays while on screen on touch devices, which cannot hover', () => {
    const phone = { ...desktop, canHover: false };
    expect(shouldPlayVideo(phone)).toBe(false);
    expect(shouldPlayVideo({ ...phone, inView: true })).toBe(true);
  });

  it('never plays with reduced motion or the on-page pause', () => {
    const hovered = { ...desktop, engaged: true, inView: true };
    expect(shouldPlayVideo({ ...hovered, reducedMotion: true })).toBe(false);
    expect(shouldPlayVideo({ ...hovered, paused: true })).toBe(false);
  });

  it('stays still until the media queries are known (before hydration)', () => {
    const hovered = { ...desktop, engaged: true, inView: true };
    expect(shouldPlayVideo({ ...hovered, reducedMotion: undefined })).toBe(false);
    expect(shouldPlayVideo({ ...hovered, canHover: undefined })).toBe(false);
  });
});

describe('projectVideosModule', () => {
  const host = 'https://abc123.public.blob.vercel-storage.com';

  it('writes a typed, sorted module', () => {
    const source = projectVideosModule({
      ro5n3r: {
        src: `${host}/projects/ro5n3r.mp4`,
        poster: `${host}/projects/ro5n3r.webp`,
        width: 1280,
        height: 720,
      },
      classping: {
        src: `${host}/projects/classping.mp4`,
        poster: `${host}/projects/classping.webp`,
        width: 1280,
        height: 720,
      },
    });
    expect(source).toContain('Partial<Record<ProjectId, ProjectVideo>>');
    expect(source.indexOf('classping:')).toBeLessThan(source.indexOf('ro5n3r:'));
    expect(source).toContain(`src: '${host}/projects/classping.mp4',`);
  });

  it('writes an empty map when nothing is uploaded', () => {
    expect(projectVideosModule({})).toContain('= {};');
  });
});
