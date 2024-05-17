export type ValueOf<T> = T[keyof T];

export function recordToArray<T extends object>(obj?: T) {
  if (!obj) {
    return [];
  }
  return Object.entries(obj) as [key: keyof T, value: ValueOf<T>][];
}
