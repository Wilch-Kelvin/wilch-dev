import { indicatorFor } from './indicator';

describe('indicatorFor', () => {
  it('centres the bar under the link, inset from its edges', () => {
    expect(indicatorFor({ left: 300, width: 100 }, { left: 200, width: 500 })).toEqual({
      x: 114,
      width: 72,
    });
  });

  it('keeps a minimum width for tiny links', () => {
    expect(indicatorFor({ left: 10, width: 20 }, { left: 0, width: 100 })).toEqual({
      x: 14,
      width: 12,
    });
  });

  it('rounds to whole pixels so the bar stays crisp', () => {
    expect(indicatorFor({ left: 10.4, width: 80.6 }, { left: 0, width: 200 })).toEqual({
      x: 24,
      width: 53,
    });
  });
});
