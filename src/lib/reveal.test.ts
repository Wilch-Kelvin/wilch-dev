import {
  isOnScreen,
  MAX_STAGGER_STEP,
  revealProps,
  shouldAnimateEntrances,
  staggerIndex,
} from './reveal';

describe('isOnScreen', () => {
  it('is true when any part of the box is inside the viewport', () => {
    expect(isOnScreen({ top: 100, bottom: 300 }, 800)).toBe(true);
    expect(isOnScreen({ top: -200, bottom: 10 }, 800)).toBe(true);
    expect(isOnScreen({ top: 790, bottom: 1200 }, 800)).toBe(true);
  });

  it('is false for boxes fully above or below the viewport', () => {
    expect(isOnScreen({ top: -300, bottom: 0 }, 800)).toBe(false);
    expect(isOnScreen({ top: 800, bottom: 1000 }, 800)).toBe(false);
  });
});

describe('shouldAnimateEntrances', () => {
  const ok = { reducedMotion: false, paused: false, hasObserver: true };

  it('animates only when motion is allowed, not paused and observable', () => {
    expect(shouldAnimateEntrances(ok)).toBe(true);
    expect(shouldAnimateEntrances({ ...ok, reducedMotion: true })).toBe(false);
    expect(shouldAnimateEntrances({ ...ok, paused: true })).toBe(false);
    expect(shouldAnimateEntrances({ ...ok, hasObserver: false })).toBe(false);
  });
});

describe('staggerIndex', () => {
  it('passes small whole numbers through', () => {
    expect(staggerIndex(0)).toBe(0);
    expect(staggerIndex(3)).toBe(3);
  });

  it('caps long lists and cleans bad input', () => {
    expect(staggerIndex(40)).toBe(MAX_STAGGER_STEP);
    expect(staggerIndex(-2)).toBe(0);
    expect(staggerIndex(Number.NaN)).toBe(0);
    expect(staggerIndex(2.7)).toBe(2);
  });
});

describe('revealProps', () => {
  it('marks the element and sets its stagger step', () => {
    expect(revealProps(2)).toEqual({ 'data-reveal': '', style: { '--i': 2 } });
    expect(revealProps()).toEqual({ 'data-reveal': '', style: { '--i': 0 } });
  });
});
