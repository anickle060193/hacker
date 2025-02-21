export function assertNever(value: never): never {
  throw new Error(`Unexpected value: ${value as unknown as string}`);
}

export async function sleep(duration: number): Promise<void> {
  await new Promise<void>((resolve) => {
    setTimeout(resolve, duration);
  });
}

export function keysToArray<T extends string>(obj: Record<T, boolean>): T[] {
  return Object.keys(obj) as T[];
}
