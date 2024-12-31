export function assertNever(value: never): never {
  throw new Error(`Unexpected value: ${value as unknown as string}`);
}
