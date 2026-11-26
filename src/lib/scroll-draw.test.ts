import { drawProgress, parseDrawMode, PEN_LINE } from './scroll-draw';

const VH = 1000; // pen at 650px

describe('drawProgress', () => {
  it('is 0 while the box is still below the pen (scrolled back up: retracted)', () => {
    expect(drawProgress({ top: 700, height: 400 }, VH)).toBe(0);
    expect(drawProgress({ top: VH * PEN_LINE, height: 400 }, VH)).toBe(0);
  });

  it('grows as the pen moves through the box', () => {
    expect(drawProgress({ top: 550, height: 400 }, VH)).toBe(0.25);
    expect(drawProgress({ top: 450, height: 400 }, VH)).toBe(0.5);
  });

  it('is 1 once the pen has passed the bottom', () => {
    expect(drawProgress({ top: 250, height: 400 }, VH)).toBe(1);
    expect(drawProgress({ top: -2000, height: 400 }, VH)).toBe(1);
  });

  it('rounds to three decimals so tiny scrolls do not rewrite styles', () => {
    expect(drawProgress({ top: 649, height: 3 }, VH)).toBe(0.333);
  });

  it('handles zero-height boxes as a switch at the pen', () => {
    expect(drawProgress({ top: 600, height: 0 }, VH)).toBe(1);
    expect(drawProgress({ top: 700, height: 0 }, VH)).toBe(0);
  });

  it('spreads a short row over at least minSpan of scrolling', () => {
    // A 64px row: without minSpan it is done 64px after the pen reaches it.
    expect(drawProgress({ top: 586, height: 64 }, VH)).toBe(1);
    expect(drawProgress({ top: 586, height: 64 }, VH, { minSpan: 320 })).toBe(0.2);
    expect(drawProgress({ top: 330, height: 64 }, VH, { minSpan: 320 })).toBe(1);
    // A tall row keeps its own height.
    expect(drawProgress({ top: 450, height: 400 }, VH, { minSpan: 320 })).toBe(0.5);
  });

  it('falls back to fully drawn on bad numbers', () => {
    expect(drawProgress({ top: Number.NaN, height: 100 }, VH)).toBe(1);
  });

  it('accepts a custom pen line', () => {
    expect(drawProgress({ top: 0, height: 1000 }, VH, { penLine: 0.5 })).toBe(0.5);
  });
});

describe('parseDrawMode', () => {
  it('reads "row" and treats everything else as the pen', () => {
    expect(parseDrawMode('row')).toBe('row');
    expect(parseDrawMode('')).toBe('pen');
    expect(parseDrawMode(undefined)).toBe('pen');
  });
});
