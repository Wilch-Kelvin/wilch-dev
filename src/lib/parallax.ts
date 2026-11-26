// Pointer parallax for the hero art: the pointer's position relative to the
// art's centre, as -1…1 on each axis. CSS multiplies it by each layer's
// depth, so near shapes move more than far ones and the cluster feels 3D.

export type Box = {
  readonly left: number;
  readonly top: number;
  readonly width: number;
  readonly height: number;
};

const clamp = (n: number) => Math.max(-1, Math.min(1, n));

export function pointerOffset(x: number, y: number, box: Box): { x: number; y: number } {
  if (box.width <= 0 || box.height <= 0) return { x: 0, y: 0 };
  const half = { w: box.width / 2, h: box.height / 2 };
  // Round so tiny pointer jitter doesn't restyle the page every frame.
  const round = (n: number) => Math.round(clamp(n) * 100) / 100;
  return {
    x: round((x - (box.left + half.w)) / half.w),
    y: round((y - (box.top + half.h)) / half.h),
  };
}
