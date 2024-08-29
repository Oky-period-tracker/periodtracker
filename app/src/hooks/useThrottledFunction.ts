import React from 'react'

export const useThrottledFunction = (func: (...args: unknown[]) => void, delay: number) => {
  const lastCallRef = React.useRef<number | null>(null)

  const throttledFunction = React.useCallback(
    (...args: unknown[]) => {
      const now = Date.now()

      if (lastCallRef.current === null || now - lastCallRef.current >= delay) {
        lastCallRef.current = now
        func(...args)
      }
    },
    [func, delay],
  )

  return throttledFunction
}
