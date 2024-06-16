import React from "react";
import { useDebounceFunction } from "./useDebounceFunction";

interface UseSearchProps<T> {
  options: T[];
  keys: (keyof T)[];
  type?: "includes" | "startsWith";
  enabled?: boolean;
}

export const useSearch = <T>({
  options,
  keys,
  type = "includes",
  enabled = true,
}: UseSearchProps<T>) => {
  const [results, setResults] = React.useState(options);
  const [query, setQuery] = React.useState("");

  const optionsWithCombinedString = React.useMemo(() => {
    return options.map((item) => ({
      ...item,
      __combined: keys
        .reduce((acc, key) => {
          const value = item[key];
          if (typeof value !== "string") {
            return acc;
          }
          return `${acc} ${value}`;
        }, "")
        .toLowerCase()
        .trim(),
    }));
  }, [options, keys]);

  const search = React.useCallback(() => {
    if (!enabled) {
      return;
    }

    const queryLowCase = query.toLowerCase();

    const searchTerms = queryLowCase.split(" ");

    const filteredOptions = optionsWithCombinedString.filter((item) => {
      if (type === "startsWith") {
        return item.__combined.startsWith(queryLowCase);
      }

      return searchTerms.every((term) => item.__combined.includes(term));
    });

    setResults(filteredOptions);
  }, [enabled, query, optionsWithCombinedString, type]);

  useDebounceFunction(search, 500);

  return {
    query,
    setQuery,
    results,
  };
};
