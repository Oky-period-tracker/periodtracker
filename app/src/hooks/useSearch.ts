import React from 'react'
import { useDebounceEffect } from './useDebounceEffect'

interface UseSearchProps<T> {
  options: T[]
  keys: (keyof T)[]
  type?: 'includes' | 'startsWith'
  enabled?: boolean
  externalQuery?: string
}

export const useSearch = <T>({
  options,
  keys,
  type = 'includes',
  enabled = true,
  externalQuery,
}: UseSearchProps<T>) => {
  if (keys.length === 0) {
    throw new Error("The 'keys' array should contain at least one key.")
  }

  const [results, setResults] = React.useState(options)
  const [query, setQuery] = React.useState(externalQuery || '')

  // Allows multiple useSearch hooks to share the same query
  React.useEffect(() => {
    setQuery(externalQuery || '')
  }, [externalQuery])

  const optionsWithCombinedString = React.useMemo(() => {
    if (keys.length === 1) {
      // No need to combine
      const key = keys[0]
      return options.map((item) => ({
        ...item,
        __combined: `${item[key]}`.toLowerCase(),
      }))
    }

    return options.map((item) => ({
      ...item,
      __combined: keys
        .reduce((acc, key) => {
          const value = item[key]
          if (typeof value !== 'string') {
            return acc
          }
          return `${acc} ${value}`
        }, '')
        .toLowerCase(),
    }))
  }, [options, keys])

  const search = React.useCallback(() => {
    if (!enabled) {
      return
    }

    const queryLowCase = query.toLowerCase()

    const searchTerms = queryLowCase.split(' ')

    const filteredOptions = optionsWithCombinedString.filter((item) => {
      if (type === 'startsWith') {
        return item.__combined.startsWith(queryLowCase)
      }

      return searchTerms.every((term) => item.__combined.includes(term))
    })

    setResults(filteredOptions)
  }, [enabled, query, optionsWithCombinedString, type])

  useDebounceEffect(search, 500)

  return {
    query,
    setQuery,
    results,
  }
}
