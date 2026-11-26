import type { Milestone } from '@/content/schema';

// The Academics line: an indigo squiggle for the road travelled, a flat grey
// line for what's ahead. Each milestone draws two halves of the line itself
// (before its dot, after its dot), so nothing is positioned by percentages
// across the whole row (review M7). These rules pick each half's look and
// when it draws.

export type SegmentKind = 'wave' | 'flat';

/** Travelled up to and including the current term; flat after "now". */
export function segmentKinds(state: Milestone['state']): {
  before: SegmentKind;
  after: SegmentKind;
} {
  switch (state) {
    case 'done':
      return { before: 'wave', after: 'wave' };
    case 'now':
      return { before: 'wave', after: 'flat' };
    case 'next':
      return { before: 'flat', after: 'flat' };
  }
}

/**
 * Draw order along the line: item 0's first half is step 0, its dot and
 * second half step 1, item 1's first half step 2, and so on. CSS turns the
 * step into a delay, so the pen travels left to right and each dot pops as
 * the line reaches it.
 */
export function drawSteps(index: number): { before: number; dot: number; after: number } {
  const base = Math.max(0, Math.floor(index)) * 2;
  return { before: base, dot: base + 1, after: base + 1 };
}
