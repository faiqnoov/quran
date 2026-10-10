import { useEffect } from "react"

const DEFAULT_TITLE = "Al-Qur'an Digital"

/**
 * Sets document.title for the active route.
 * Reverts to previous title when the route component unmounts.
 */
export function usePageTitle(title?: string): void {
  useEffect(() => {
    const previous = document.title
    if (title) {
      document.title = `${title} | Al-Qur'an`
    } else {
      document.title = DEFAULT_TITLE
    }

    return () => {
      document.title = previous
    }
  }, [title])
}
