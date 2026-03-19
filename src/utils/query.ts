export function cleanParams<T extends Record<string, unknown>>(params?: T): Partial<T> {
  if (!params) return {};
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== ''),
  ) as Partial<T>;
}

