import { useRef, useEffect } from 'react'

export function usePrevious(value) {
  const ref = useRef(null)

  useEffect(() => {
    ref.current = value
  }, [value])

  return ref.current
}
