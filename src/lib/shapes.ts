// The Material 3 Expressive shape set used across the site, as SVG path data
// on a 200×200 box. Drawn once in a hidden sprite and reused with <use>.
// A stroke in the same colour (round joins) softens the points, which is what
// gives the shapes their "cookie" look.

export const shapePaths = {
  cookie12:
    'M100.0 16.0A34.8 34.8 0 0 1 142.0 27.3A34.8 34.8 0 0 1 172.7 58.0A34.8 34.8 0 0 1 184.0 100.0A34.8 34.8 0 0 1 172.7 142.0A34.8 34.8 0 0 1 142.0 172.7A34.8 34.8 0 0 1 100.0 184.0A34.8 34.8 0 0 1 58.0 172.7A34.8 34.8 0 0 1 27.3 142.0A34.8 34.8 0 0 1 16.0 100.0A34.8 34.8 0 0 1 27.3 58.0A34.8 34.8 0 0 1 58.0 27.3A34.8 34.8 0 0 1 100.0 16.0Z',
  cookie9:
    'M100.0 20.0A41.0 41.0 0 0 1 151.4 38.7A41.0 41.0 0 0 1 178.8 86.1A41.0 41.0 0 0 1 169.3 140.0A41.0 41.0 0 0 1 127.4 175.2A41.0 41.0 0 0 1 72.6 175.2A41.0 41.0 0 0 1 30.7 140.0A41.0 41.0 0 0 1 21.2 86.1A41.0 41.0 0 0 1 48.6 38.7A41.0 41.0 0 0 1 100.0 20.0Z',
  clover4:
    'M143.8 56.2A44.7 44.7 0 0 1 143.8 143.8A44.7 44.7 0 0 1 56.2 143.8A44.7 44.7 0 0 1 56.2 56.2A44.7 44.7 0 0 1 143.8 56.2Z',
  flower6:
    'M100.0 30.0A38.5 38.5 0 0 1 160.6 65.0A38.5 38.5 0 0 1 160.6 135.0A38.5 38.5 0 0 1 100.0 170.0A38.5 38.5 0 0 1 39.4 135.0A38.5 38.5 0 0 1 39.4 65.0A38.5 38.5 0 0 1 100.0 30.0Z',
  burst8:
    'M100.0 22.0A37.3 37.3 0 0 1 155.2 44.8A37.3 37.3 0 0 1 178.0 100.0A37.3 37.3 0 0 1 155.2 155.2A37.3 37.3 0 0 1 100.0 178.0A37.3 37.3 0 0 1 44.8 155.2A37.3 37.3 0 0 1 22.0 100.0A37.3 37.3 0 0 1 44.8 44.8A37.3 37.3 0 0 1 100.0 22.0Z',
} as const;

export type ShapeName = keyof typeof shapePaths;

/** The softening stroke width each shape was tuned with in the design. */
export const shapeStroke: Readonly<Record<ShapeName, number>> = {
  cookie12: 10,
  cookie9: 10,
  clover4: 14,
  flower6: 12,
  burst8: 10,
};

export function shapeId(name: ShapeName): string {
  return `s-${name}`;
}
