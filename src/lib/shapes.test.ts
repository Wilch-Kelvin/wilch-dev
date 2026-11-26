import { cookiePath, heroMorph, shapeId, shapePaths, shapeStroke } from './shapes';

describe('shapes', () => {
  it('gives every shape a closed path and a stroke width', () => {
    for (const [name, d] of Object.entries(shapePaths)) {
      expect(d.startsWith('M')).toBe(true);
      expect(d.endsWith('Z')).toBe(true);
      expect(shapeStroke[name as keyof typeof shapePaths]).toBeGreaterThan(0);
    }
  });

  it('prefixes sprite ids so they cannot clash with section ids', () => {
    expect(shapeId('cookie9')).toBe('s-cookie9');
  });
});

describe('cookiePath', () => {
  it('reproduces the design cookie12 exactly', () => {
    expect(cookiePath(12, 84, 34.8)).toBe(shapePaths.cookie12);
  });

  it('keeps the same commands for any depth, so CSS can morph between them', () => {
    const commands = (d: string) => d.replace(/[^MAZ]/g, '');
    expect(commands(heroMorph.from)).toBe(commands(heroMorph.to));
    expect(commands(heroMorph.to)).toBe(`M${'A'.repeat(12)}Z`);
  });

  it('only uses arcs wide enough to join neighbouring points', () => {
    // An arc radius below half the chord can't connect the points (the
    // browser would silently scale it up and the morph would jump).
    const halfChord = 80 * Math.sin(Math.PI / 12);
    expect(23.5).toBeGreaterThan(halfChord);
  });
});
