import { colors } from '@/theme/colors';
import {
  buildButtonCode,
  clampRadius,
  codeToText,
  defaultChoice,
  fillById,
  fills,
  shownLabel,
} from './button-code';

describe('button builder', () => {
  it('falls back when the label is empty or spaces', () => {
    expect(shownLabel('', 'Button', 24)).toBe('Button');
    expect(shownLabel('   ', 'Button', 24)).toBe('Button');
    expect(shownLabel(' Ping me ', 'Button', 24)).toBe('Ping me');
  });

  it('cuts long labels to the limit', () => {
    expect(shownLabel('x'.repeat(40), 'Button', 24)).toHaveLength(24);
  });

  it('keeps the radius inside the slider range', () => {
    expect(clampRadius(-5)).toBe(0);
    expect(clampRadius(99)).toBe(40);
    expect(clampRadius(12.6)).toBe(13);
    expect(clampRadius(Number.NaN)).toBe(24);
  });

  it('finds fills and defaults to primary', () => {
    expect(fillById('tertiary').bg).toBe('tertiary-c');
    expect(fills.map((f) => f.id)).toEqual(['primary', 'tertiary', 'secondary', 'inverse']);
  });

  it('writes portable CSS with the theme colours resolved', () => {
    const code = codeToText(
      buildButtonCode({ ...defaultChoice('Hi'), radius: 12 }, 'Hi', colors.light),
    );
    expect(code).toContain('<button class="ping-btn">');
    expect(code).toContain('border-radius: 12px;');
    expect(code).toContain(`background: ${colors.light.primary};`);
    expect(code).toContain(`color: ${colors.light['on-primary']};`);
    expect(code).not.toContain('var(--');
  });

  it('uses the dark values in dark mode', () => {
    const code = codeToText(buildButtonCode(defaultChoice('Hi'), 'Hi', colors.dark));
    expect(code).toContain(`background: ${colors.dark.primary};`);
  });

  it('escapes HTML in the label', () => {
    const code = codeToText(buildButtonCode(defaultChoice('<b>'), '<b> & "x"', colors.light));
    expect(code).toContain('&lt;b&gt; &amp; &quot;x&quot;');
  });
});
