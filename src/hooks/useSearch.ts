import { useMemo } from "react"
import { useSurahList } from "./useSurahList"
import { useDebounce } from "./useDebounce"
import type { SurahMeta } from "@/types/quran"

export interface SearchResult {
  /** The filtered list of surahs based on the search query. */
  results: SurahMeta[]
  /** If the user typed "2:255" or "2 255", this contains the destination URL. */
  directNavIntent?: string
  isSearching: boolean
}

// Remove diacritics / combining characters
function removeDiacritics(str: string) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
}

function parseDirectNavIntent(query: string): string | undefined {
  const match = query.match(/^(\d+)[^\w\d]+(\d+)$/)
  if (match) {
    const surah = parseInt(match[1], 10)
    const ayah = parseInt(match[2], 10)
    if (surah >= 1 && surah <= 114 && ayah >= 1) {
      return `/surah/${surah}?ayat=${ayah}`
    }
  }
  return undefined
}

export function useSearch(query: string): SearchResult {
  const debouncedQuery = useDebounce(query, 300)
  const { data: surahs } = useSurahList()

  const result = useMemo(() => {
    const trimmed = debouncedQuery.trim()
    if (!trimmed || !surahs) {
      return { results: surahs || [], isSearching: false }
    }

    const intent = parseDirectNavIntent(trimmed)
    if (intent) {
      return { results: [], directNavIntent: intent, isSearching: true }
    }

    const lowerQuery = removeDiacritics(trimmed.toLowerCase())
    
    const filtered = surahs.filter((surah) => {
      const matchNama = removeDiacritics(surah.namaLatin.toLowerCase()).includes(lowerQuery)
      const matchArti = removeDiacritics(surah.arti.toLowerCase()).includes(lowerQuery)
      const matchNomor = surah.nomor.toString() === lowerQuery
      
      return matchNama || matchArti || matchNomor
    })

    return { results: filtered, isSearching: true }
  }, [debouncedQuery, surahs])

  return result
}
