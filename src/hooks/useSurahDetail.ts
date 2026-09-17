import { useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { getSurahDetail } from "@/api/quran"
import type { SurahDetail } from "@/types/quran"

/**
 * Validates and parses a surah number.
 * Must be an integer between 1 and 114 (inclusive).
 * Returns the parsed number if valid, or null otherwise.
 */
export function parseSurahNumber(value: string | number | undefined): number | null {
  if (value === undefined || value === null) return null
  if (typeof value === "number") {
    return Number.isInteger(value) && value >= 1 && value <= 114 ? value : null
  }
  const trimmed = String(value).trim()
  if (!/^\d+$/.test(trimmed)) return null
  const parsed = Number(trimmed)
  return parsed >= 1 && parsed <= 114 ? parsed : null
}

/**
 * Fetches full detail for a single surah including all ayahs.
 * If nomor is invalid (non-numeric, <1, >114), it redirects to /not-found
 * and suppresses the network request (enabled: false).
 */
export function useSurahDetail(nomorInput?: number | string) {
  const { nomor: routeNomor } = useParams<{ nomor: string }>()
  const navigate = useNavigate()

  const rawNomor = nomorInput ?? routeNomor
  const validNomor = parseSurahNumber(rawNomor)

  useEffect(() => {
    if (validNomor === null) {
      navigate("/not-found", { replace: true })
    }
  }, [validNomor, navigate])

  return useQuery<SurahDetail>({
    queryKey: ["surah", validNomor],
    queryFn: () => getSurahDetail(validNomor!),
    enabled: validNomor !== null,
  })
}
