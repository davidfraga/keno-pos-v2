const tryParseMultiple = <T = unknown>(acc: T[], item: string) => {
  try {
    return [...acc, JSON.parse(item) as T];
  } catch {
    return acc;
  }
};

const tryParseOne = <T = unknown>(item: string) => {
  try {
    return JSON.parse(item) as T;
  } catch {
    return undefined;
  }
};

export const tryParse = <T = unknown>(acc: T[] | string, item: string) => {
  if (typeof acc === 'string') return tryParseOne<T>(acc);

  if (!Array.isArray(acc) || typeof item !== 'string') return undefined;
  return tryParseMultiple<T>(acc, item);
};

export default tryParse;
