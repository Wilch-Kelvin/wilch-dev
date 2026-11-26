import { colors, type Palette } from './colors';

// Turns the colour object into CSS custom properties. The layout inlines the
// result in <head>, so the tokens exist before first paint and there is only
// one place (colors.ts) to change a colour.

function declarations(palette: Palette): string {
  return Object.entries(palette)
    .map(([name, value]) => `--${name}:${value};`)
    .join('');
}

/**
 * Light by default; dark when the system asks for it unless the visitor chose
 * light; dark when the visitor chose dark. `data-theme` is set before paint by
 * the inline script in the layout.
 */
export function tokensCss(): string {
  const light = declarations(colors.light);
  const dark = declarations(colors.dark);
  return [
    `:root{color-scheme:light;${light}}`,
    `@media (prefers-color-scheme: dark){:root:not([data-theme="light"]){color-scheme:dark;${dark}}}`,
    `:root[data-theme="dark"]{color-scheme:dark;${dark}}`,
  ].join('\n');
}
