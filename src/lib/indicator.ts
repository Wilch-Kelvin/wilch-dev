// The nav's sliding "you are here" underline. It is one element that moves,
// not one underline per link that fades, so the eye can follow it from the
// old section to the new one. This works out where it should sit.

export type Span = { readonly left: number; readonly width: number };
export type IndicatorGeometry = { readonly x: number; readonly width: number };

/** Underline inset from each side of the link's pill, in px. */
export const INDICATOR_INSET = 14;

/**
 * Position of the underline under `link`, relative to its list. Very narrow
 * links still get a visible bar (at least 12px).
 */
export function indicatorFor(link: Span, list: Span, inset = INDICATOR_INSET): IndicatorGeometry {
  const width = Math.max(12, link.width - inset * 2);
  const x = link.left - list.left + (link.width - width) / 2;
  return { x: Math.round(x), width: Math.round(width) };
}
