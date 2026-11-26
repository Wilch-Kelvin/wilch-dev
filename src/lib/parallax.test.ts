import { pointerOffset } from './parallax';

const box = { left: 100, top: 100, width: 200, height: 100 };

describe('pointerOffset', () => {
  it('is zero at the centre and ±1 at the edges', () => {
    expect(pointerOffset(200, 150, box)).toEqual({ x: 0, y: 0 });
    expect(pointerOffset(300, 200, box)).toEqual({ x: 1, y: 1 });
    expect(pointerOffset(100, 100, box)).toEqual({ x: -1, y: -1 });
  });

  it('clamps far-away pointers and rounds to two decimals', () => {
    expect(pointerOffset(2000, -900, box)).toEqual({ x: 1, y: -1 });
    expect(pointerOffset(233.333, 150, box)).toEqual({ x: 0.33, y: 0 });
  });

  it('is zero for an empty box instead of dividing by zero', () => {
    expect(pointerOffset(10, 10, { left: 0, top: 0, width: 0, height: 0 })).toEqual({ x: 0, y: 0 });
  });
});
