export function randomBetween(a: number, b: number) {
  const min = Math.min(a, b);
  const max = Math.max(a, b);

  return (max - min) * Math.random() + min;
}

export function randomChoice<T>(array: T[]): T {
  return array[Math.floor(array.length * Math.random())];
}
