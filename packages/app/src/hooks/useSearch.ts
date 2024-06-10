import React from "react";
import { useDebounceFunction } from "./useDebounceFunction";

interface UseSearchProps<T> {
  options: T[];
  key: keyof T;
  enabled?: boolean;
}

export const useSearch = <T>({
  options,
  key,
  enabled = true,
}: UseSearchProps<T>) => {
  const [results, setResults] = React.useState(options);
  const [query, setQuery] = React.useState("");

  const search = React.useCallback(() => {
    if (!enabled) {
      return;
    }

    const queryLowCase = query.toLocaleLowerCase();

    const filteredOptions = options.filter((item) => {
      const value = item?.[key];

      if (typeof value === "string") {
        return value?.toLowerCase().startsWith(queryLowCase);
      }

      return false;
    });

    setResults(filteredOptions);
  }, [query]);

  useDebounceFunction(search, 500, [query]);

  return {
    query,
    setQuery,
    results,
  };
};
