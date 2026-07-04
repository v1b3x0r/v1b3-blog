export function createShuffleBag<T>(
  items: readonly T[],
  previous: T | null,
  random: () => number = Math.random,
): T[] {
  const bag = [...items];

  for (let index = bag.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [bag[index], bag[swapIndex]] = [bag[swapIndex], bag[index]];
  }

  if (bag.length > 1 && previous !== null && bag[0] === previous) {
    [bag[0], bag[1]] = [bag[1], bag[0]];
  }

  return bag;
}
