import { drawSteps, segmentKinds } from './timeline';

describe('segmentKinds', () => {
  it('squiggles the travelled road and flattens the future', () => {
    expect(segmentKinds('done')).toEqual({ before: 'wave', after: 'wave' });
    expect(segmentKinds('now')).toEqual({ before: 'wave', after: 'flat' });
    expect(segmentKinds('next')).toEqual({ before: 'flat', after: 'flat' });
  });
});

describe('drawSteps', () => {
  it('draws left to right, popping each dot as the line arrives', () => {
    expect(drawSteps(0)).toEqual({ before: 0, dot: 1, after: 1 });
    expect(drawSteps(2)).toEqual({ before: 4, dot: 5, after: 5 });
  });

  it('treats bad indexes as the first item', () => {
    expect(drawSteps(-1)).toEqual({ before: 0, dot: 1, after: 1 });
  });
});
