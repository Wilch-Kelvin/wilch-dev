// Scroll-drawn lines (the Academics squiggle and the Resume career curve).
// Unlike the springy reveals in reveal.ts, these are *scrubbed* on purpose:
// the line is glued to the scrollbar, so scrolling down draws it toward its
// end and scrolling back up retracts it. The hook writes the number this
// file computes into a `--draw` CSS variable; CSS turns it into a clip or a
// stroke offset. Keeping the maths here means it can be tested without a
// browser.

/** The bit of a DOMRect we need, so tests don't have to build one. */
export type DrawBox = { readonly top: number; readonly height: number };

/**
 * Where the "pen" sits, as a fraction of the viewport height from the top.
 * Below the middle, so the tip of the line is drawn where the eye already
 * is, a little ahead of the content being read.
 */
export const PEN_LINE = 0.65;

/**
 * A horizontal row is short (the career path is one 64px row), so drawing it
 * over its own height would finish in a flick of the wheel. Rows draw over
 * at least this fraction of the viewport height of scrolling instead.
 */
export const ROW_MIN_SPAN = 0.35;

export type DrawMode = 'pen' | 'row';

/** `data-scroll-draw="row"` marks a row; anything else follows the pen. */
export function parseDrawMode(value: string | undefined): DrawMode {
  return value === 'row' ? 'row' : 'pen';
}

/**
 * How much of the box the pen has passed, from 0 (pen above the box, line
 * hidden) to 1 (pen below it, fully drawn). With no `minSpan` the tip of a
 * vertical line follows the pen exactly; a row passes `minSpan` so its draw
 * is spread over a comfortable stretch of scrolling.
 */
export function drawProgress(
  box: DrawBox,
  viewportHeight: number,
  { penLine = PEN_LINE, minSpan = 0 }: { penLine?: number; minSpan?: number } = {},
): number {
  const pen = viewportHeight * penLine;
  if (!Number.isFinite(box.top) || !Number.isFinite(pen)) return 1;
  const span = Math.max(box.height, minSpan);
  if (span <= 0) return box.top <= pen ? 1 : 0;
  const raw = (pen - box.top) / span;
  // Three decimals is finer than a pixel on any line here, and lets the
  // hook skip style writes when nothing visible changed.
  return Math.round(Math.min(1, Math.max(0, raw)) * 1000) / 1000;
}
