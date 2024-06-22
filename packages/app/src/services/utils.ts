import { Moment } from "moment";
import { months } from "../data/data";

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

export const reactNodeExists = (node: React.ReactNode): boolean => {
  if (Array.isArray(node)) {
    return node.filter((item) => !!item).length > 0;
  }

  return !!node;
};

export const formatDate = (date: Date) => {
  // 'YYYY-MM-DD'
  return date.toISOString().split("T")[0];
};

export const formatDayMonth = (date: Date) => {
  // `DD Month`
  const day = date.getDate();
  const monthIndex = date.getMonth();
  const month = months[monthIndex];
  return `${day}\n${month}`;
};

export const formatMomentDayMonth = (date: Moment) => {
  // `DD Month`
  return `${date.format("DD")}\n${months[date.month()]}`;
};
