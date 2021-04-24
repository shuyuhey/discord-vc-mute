export function diedCompareFunction<T extends { isDied: boolean }>(direction: 'diedFirst' | 'diedLast' = 'diedFirst'): (a: T, b: T) => number {

  const factor = (direction === 'diedLast' ? -1 : 1);

  return (a, b) => {
    return (a.isDied ? -1 : 1) * factor;
  };
}