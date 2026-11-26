import { MOTION_STORAGE_KEY, parseMotion, toggleMotion } from './motion';
import {
  oppositeTheme,
  parseTheme,
  resolveTheme,
  THEME_STORAGE_KEY,
  themeInitScript,
} from './theme';

describe('theme', () => {
  it('only accepts known values from storage', () => {
    expect(parseTheme('dark')).toBe('dark');
    expect(parseTheme('light')).toBe('light');
    expect(parseTheme('purple')).toBeNull();
    expect(parseTheme(null)).toBeNull();
  });

  it('lets a saved choice beat the system setting', () => {
    expect(resolveTheme('light', true)).toBe('light');
    expect(resolveTheme('dark', false)).toBe('dark');
  });

  it('follows the system when nothing is saved', () => {
    expect(resolveTheme(null, true)).toBe('dark');
    expect(resolveTheme(null, false)).toBe('light');
  });

  it('flips', () => {
    expect(oppositeTheme('dark')).toBe('light');
    expect(oppositeTheme('light')).toBe('dark');
  });

  it('builds a pre-paint script that reads both storage keys', () => {
    const script = themeInitScript(MOTION_STORAGE_KEY);
    expect(script).toContain(THEME_STORAGE_KEY);
    expect(script).toContain(MOTION_STORAGE_KEY);
    // Storage can throw in private windows; the script must never break the page.
    expect(script).toContain('try{');
  });
});

describe('motion preference', () => {
  it('defaults to playing', () => {
    expect(parseMotion(null)).toBe('playing');
    expect(parseMotion('nonsense')).toBe('playing');
    expect(parseMotion('paused')).toBe('paused');
  });

  it('toggles', () => {
    expect(toggleMotion('playing')).toBe('paused');
    expect(toggleMotion('paused')).toBe('playing');
  });
});
