// Theme choice: follow the system until the visitor picks, then remember it.
// Pure functions here; the hook and the pre-paint script both use them.

export type Theme = 'light' | 'dark';
export const THEME_STORAGE_KEY = 'wilch-theme';

/** Reads a stored value, ignoring anything that isn't a known theme. */
export function parseTheme(value: string | null | undefined): Theme | null {
  return value === 'light' || value === 'dark' ? value : null;
}

/** The saved choice wins; otherwise the system setting decides. */
export function resolveTheme(saved: Theme | null, systemPrefersDark: boolean): Theme {
  return saved ?? (systemPrefersDark ? 'dark' : 'light');
}

export function oppositeTheme(theme: Theme): Theme {
  return theme === 'dark' ? 'light' : 'dark';
}

/**
 * A tiny script inlined in <head>. It runs before the first paint so a saved
 * dark choice never flashes white. Kept as a string because it must run
 * before React loads. It mirrors resolveTheme above, and so does the motion
 * preference (see motion.ts).
 */
export function themeInitScript(motionKey: string): string {
  return `(function(){try{var d=document.documentElement;var t=localStorage.getItem('${THEME_STORAGE_KEY}');if(t==='light'||t==='dark'){d.dataset.theme=t}var m=localStorage.getItem('${motionKey}');if(m==='paused'){d.dataset.motion='paused'}}catch(e){}})();`;
}
