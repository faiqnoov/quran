import type { SurahMeta, SurahDetail, TafsirDetail } from "@/types/quran"
import { fetchApi } from "./client"

export const SURAH_LIST_CACHE_KEY = "quran-surahs-cache"
const SURAH_DETAIL_CACHE_PREFIX = "quran-surah-detail-"

/**
 * Retrieve the cached surah list from localStorage, if available.
 */
export function getCachedSurahList(): SurahMeta[] | null {
  try {
    const raw = localStorage.getItem(SURAH_LIST_CACHE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as SurahMeta[]
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed
    }
  } catch {
    // Ignore parse or storage errors
  }
  return null
}

/**
 * Fetch the list of all 114 surahs.
 * If the network/API request fails, falls back to the last cached copy in localStorage.
 */
export async function getSurahList(): Promise<SurahMeta[]> {
  try {
    const list = await fetchApi<SurahMeta[]>("/surat")
    try {
      localStorage.setItem(SURAH_LIST_CACHE_KEY, JSON.stringify(list))
    } catch {
      // Storage quota or private mode error - ignore
    }
    return list
  } catch (err) {
    const cached = getCachedSurahList()
    if (cached) {
      return cached
    }
    throw err
  }
}

/**
 * Fetch a single surah's full detail including all ayahs.
 * Falls back to cached copy if available when offline or on API failure.
 */
export async function getSurahDetail(nomor: number): Promise<SurahDetail> {
  const cacheKey = `${SURAH_DETAIL_CACHE_PREFIX}${nomor}`
  try {
    const detail = await fetchApi<SurahDetail>(`/surat/${nomor}`)
    try {
      localStorage.setItem(cacheKey, JSON.stringify(detail))
    } catch {
      // Ignore storage error
    }
    return detail
  } catch (err) {
    try {
      const raw = localStorage.getItem(cacheKey)
      if (raw) {
        const cached = JSON.parse(raw) as SurahDetail
        if (cached && cached.nomor === nomor) {
          return cached
        }
      }
    } catch {
      // Ignore parse error
    }
    throw err
  }
}

/** Fetch Kemenag tafsir for every ayah in a surah. */
export function getTafsir(nomor: number): Promise<TafsirDetail> {
  return fetchApi<TafsirDetail>(`/tafsir/${nomor}`)
}
