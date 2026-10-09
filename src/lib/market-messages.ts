export function mergeMarketMessages<T extends object>(base: T, overrides: object): T {
  const merged = { ...base } as Record<string, unknown>;
  for (const [key, value] of Object.entries(overrides)) {
    const previous = merged[key];
    merged[key] = value && typeof value === 'object' && !Array.isArray(value)
      && previous && typeof previous === 'object' && !Array.isArray(previous)
      ? mergeMarketMessages(previous, value) : value;
  }
  return merged as T;
}
