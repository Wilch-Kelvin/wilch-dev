import { shapeId, shapePaths, shapeStroke } from './shapes';

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
