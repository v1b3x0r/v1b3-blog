import { describe, expect, it } from 'vitest';
import { createShuffleBag } from './shuffle-bag';

describe('createShuffleBag', () => {
  it('contains every id exactly once', () => {
    expect(createShuffleBag(['a', 'b', 'c'], null, () => 0.5).sort())
      .toEqual(['a', 'b', 'c']);
  });

  it('avoids repeating the previous track first', () => {
    const bag = createShuffleBag(['a', 'b', 'c'], 'a', () => 0);
    expect(bag[0]).not.toBe('a');
  });

  it('supports a one-track playlist', () => {
    expect(createShuffleBag(['a'], 'a', () => 0)).toEqual(['a']);
  });
});
