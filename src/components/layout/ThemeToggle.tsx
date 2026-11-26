'use client';

import { Icon } from '@/components/ui/Icon';
import { nav } from '@/content/site';
import { useTheme } from '@/hooks/useTheme';
import { oppositeTheme } from '@/lib/theme';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  // Before hydration the theme is unknown; the label stays generic until then.
  const label = theme === 'dark' ? nav.themeToLight : nav.themeToDark;
  return (
    <button
      type="button"
      className="icon-btn state-layer"
      aria-label={theme ? label : 'Toggle theme'}
      onClick={() => setTheme(oppositeTheme(theme ?? 'light'))}
    >
      <Icon name="moon" className="theme-icon-light" />
      <Icon name="sun" className="theme-icon-dark" />
    </button>
  );
}
