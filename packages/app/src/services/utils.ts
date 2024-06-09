export type ValueOf<T> = T[keyof T];

export function recordToArray<T extends object>(obj?: T) {
  if (!obj) {
    return [];
  }
  return Object.entries(obj) as [key: keyof T, value: ValueOf<T>][];
}

export const generateRange = (start: number, end: number) => {
  const arr: number[] = [];

  if (start > end) {
    for (let i = start; i >= end; i--) {
      arr.push(i);
    }
  }

  for (let i = start; i <= end; i++) {
    arr.push(i);
  }

  return arr;
};
