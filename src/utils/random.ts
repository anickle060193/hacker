export function randomBetween(a: number, b: number) {
  const min = Math.min(a, b);
  const max = Math.max(a, b);

  return (max - min) * Math.random() + min;
}
