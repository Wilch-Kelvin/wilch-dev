import { composite, contrastRatio, parseColor, textContrast } from './contrast';

describe('contrast maths', () => {
  it('parses hex and rgba', () => {
    expect(parseColor('#fff')).toEqual({ r: 255, g: 255, b: 255, a: 1 });
    expect(parseColor('#4F3FD9')).toEqual({ r: 79, g: 63, b: 217, a: 1 });
    expect(parseColor('#00000080').a).toBeCloseTo(0.502, 2);
    expect(parseColor('rgba(10, 20, 30, 0.5)')).toEqual({ r: 10, g: 20, b: 30, a: 0.5 });
  });

  it('rejects colours it cannot read', () => {
    expect(() => parseColor('tomato')).toThrow();
  });

  it('matches the known WCAG extremes', () => {
    expect(contrastRatio(parseColor('#000'), parseColor('#fff'))).toBeCloseTo(21, 5);
    expect(contrastRatio(parseColor('#777'), parseColor('#777'))).toBe(1);
  });

  it('matches the brand-palette checker for indigo on white (6.90)', () => {
    expect(textContrast('#FFFFFF', '#4F3FD9')).toBeCloseTo(6.9, 1);
  });

  it('composites translucent layers before measuring', () => {
    const half = composite(parseColor('rgba(0, 0, 0, 0.5)'), parseColor('#ffffff'));
    expect(Math.round(half.r)).toBe(128);
    expect(textContrast('#000', 'rgba(255,255,255,0.5)', '#000')).toBeCloseTo(
      contrastRatio(parseColor('#000'), parseColor('#808080')),
      1,
    );
  });

  it('refuses a translucent bottom layer', () => {
    expect(() => textContrast('#000', 'rgba(0,0,0,0.5)')).toThrow();
  });
});
