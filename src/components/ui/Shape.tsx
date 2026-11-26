import type { CSSProperties } from 'react';
import { shapeId, shapePaths, shapeStroke, type ShapeName } from '@/lib/shapes';

/** For `clip-path: url(#…)`: the scalloped cookie as a clipping mask. */
export const COOKIE_CLIP_ID = 's-clip-cookie12';

/** Drawn once in the layout; every <Shape> points at these paths. */
export function ShapeSprite() {
  return (
    <svg
      width="0"
      height="0"
      aria-hidden="true"
      style={{ position: 'absolute', overflow: 'hidden' }}
    >
      <defs>
        {Object.entries(shapePaths).map(([name, d]) => (
          <path key={name} id={shapeId(name as ShapeName)} d={d} />
        ))}
        {/* objectBoundingBox units make the clip scale with whatever it is
            applied to (0–1 instead of 0–200), so one clip fits any size. */}
        <clipPath id={COOKIE_CLIP_ID} clipPathUnits="objectBoundingBox">
          <path d={shapePaths.cookie12} transform="scale(0.005)" />
        </clipPath>
      </defs>
    </svg>
  );
}

type ShapeProps = {
  name: ShapeName;
  /** A CSS colour, normally a token like `var(--primary-c)`. */
  color: string;
  className?: string;
  style?: CSSProperties;
  /** Skip the softening stroke for small icon-sized shapes. */
  flat?: boolean;
};

/** One of the M3 Expressive shapes. Always decorative. */
export function Shape({ name, color, className, style, flat = false }: ShapeProps) {
  return (
    <svg
      viewBox="0 0 200 200"
      aria-hidden="true"
      focusable="false"
      className={className}
      style={{ overflow: 'visible', ...style }}
    >
      <use
        href={`#${shapeId(name)}`}
        style={{
          fill: color,
          stroke: flat ? 'none' : color,
          strokeWidth: shapeStroke[name],
          strokeLinejoin: 'round',
        }}
      />
    </svg>
  );
}
