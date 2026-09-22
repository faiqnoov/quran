import { useEffect, useRef } from "react"
import { useLastReadStore } from "@/store/lastReadStore"

/** Minimum interval (ms) between localStorage writes. */
const THROTTLE_MS = 3000

/**
 * Tracks the topmost visible ayah on the surah detail page using
 * IntersectionObserver and persists it as the last-read position.
 *
 * Writes are throttled so we don't hit localStorage on every scroll event.
 * The observer watches all `[id^="ayah-"]` elements within `containerRef`.
 */
export function useLastReadTracker(
  surahNumber: number | undefined,
  surahName: string | undefined,
) {
  const setLastRead = useLastReadStore((s) => s.setLastRead)

  // Track the most recently written ayah + timestamp to throttle writes
  const lastWriteRef = useRef<{ ayah: number; time: number }>({
    ayah: 0,
    time: 0,
  })
  const pendingRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!surahNumber || !surahName) return

    // Collect all ayah elements currently in the DOM
    const ayahElements = document.querySelectorAll<HTMLElement>(
      '[id^="ayah-"]',
    )
    if (ayahElements.length === 0) return

    // Set of currently intersecting ayah numbers
    const visibleAyahs = new Set<number>()

    function persist(ayahNumber: number) {
      if (!surahNumber || !surahName) return

      const now = Date.now()
      const last = lastWriteRef.current

      // Skip if same ayah or within throttle window
      if (last.ayah === ayahNumber && now - last.time < THROTTLE_MS) return

      // Clear any pending delayed write
      if (pendingRef.current) {
        clearTimeout(pendingRef.current)
        pendingRef.current = null
      }

      const elapsed = now - last.time
      if (elapsed >= THROTTLE_MS) {
        // Enough time has passed — write immediately
        lastWriteRef.current = { ayah: ayahNumber, time: now }
        setLastRead({ surahNumber, surahName, ayahNumber })
      } else {
        // Schedule a delayed write for the remaining throttle window
        pendingRef.current = setTimeout(() => {
          const writeTime = Date.now()
          lastWriteRef.current = { ayah: ayahNumber, time: writeTime }
          setLastRead({ surahNumber, surahName, ayahNumber })
          pendingRef.current = null
        }, THROTTLE_MS - elapsed)
      }
    }

    function findTopmostVisible() {
      if (visibleAyahs.size === 0) return
      // The smallest ayah number among visible ones closest to viewport top
      persist(Math.min(...visibleAyahs))
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.id // e.g. "ayah-42"
          const num = Number(id.replace("ayah-", ""))
          if (Number.isNaN(num)) continue

          if (entry.isIntersecting) {
            visibleAyahs.add(num)
          } else {
            visibleAyahs.delete(num)
          }
        }

        findTopmostVisible()
      },
      {
        // Trigger when the top of an ayah enters the top 30% of the viewport
        rootMargin: "0px 0px -70% 0px",
        threshold: 0,
      },
    )

    ayahElements.forEach((el) => observer.observe(el))

    return () => {
      observer.disconnect()

      // Flush any pending throttled write on unmount
      if (pendingRef.current) {
        clearTimeout(pendingRef.current)
        pendingRef.current = null
      }
    }
  }, [surahNumber, surahName, setLastRead])
}
