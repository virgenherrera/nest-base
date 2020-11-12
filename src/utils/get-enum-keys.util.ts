export function getEnumKeys<T = Record<string, any>>(_enum: T): string[] {
  return Object.keys(_enum).reduce((acc, key) => {
    const value = _enum[key];

    if (typeof value === 'string') acc.push(value);

    return acc;
  }, []);
}
