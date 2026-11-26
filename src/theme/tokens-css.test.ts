import { colors } from './colors';
import { tokensCss } from './tokens-css';

describe('tokensCss', () => {
  const css = tokensCss();

  it('declares every light token on :root', () => {
    for (const [name, value] of Object.entries(colors.light)) {
      expect(css).toContain(`--${name}:${value};`);
    }
  });

  it('switches to dark for the system setting and for a saved choice', () => {
    expect(css).toContain('@media (prefers-color-scheme: dark){:root:not([data-theme="light"])');
    expect(css).toContain(':root[data-theme="dark"]');
    expect(css).toContain('--surface:#000000;');
  });
});
