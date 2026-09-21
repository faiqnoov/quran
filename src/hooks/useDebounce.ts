import { useState, useEffect } from "react"

/**
 * Hook to debounce a value by a specified delay (in ms).
 * Returns the debounced value which only updates after the delay has passed
 * without any further changes to the input value.
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}
