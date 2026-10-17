import { useMemo } from "react"
import { useQueries } from "@tanstack/react-query"
import { getSurahDetail } from "@/api/quran"
import { getAyahsInPage, getSurahsOnPage, type MushafPage } from "@/data"
import type { Ayah, SurahDetail } from "@/types/quran"

export interface PageSurahSection {
  surah: SurahDetail
  startAyah: number
  endAyah: number
  isSurahStart: boolean
  ayahs: Ayah[]
}

export interface UseMushafPageResult {
  pageMeta: MushafPage
  surahSections: PageSurahSection[]
  isLoading: boolean
  isError: boolean
  error: Error | null
  refetch: () => void
}

/**
 * Custom hook to fetch all surahs belonging to a mushaf page in parallel,
 * slicing ayahs to match the exact page boundaries.
 */
export function useMushafPage(pageNumber: number): UseMushafPageResult {
  const safePage = useMemo(() => {
    return Math.max(1, Math.min(604, Math.trunc(pageNumber || 1)))
  }, [pageNumber])

  const pageMeta = useMemo(() => getAyahsInPage(safePage), [safePage])
  const surahNumbers = useMemo(() => getSurahsOnPage(safePage), [safePage])

  const queries = useQueries({
    queries: surahNumbers.map((nomor) => ({
      queryKey: ["surah", nomor],
      queryFn: () => getSurahDetail(nomor),
      staleTime: 1000 * 60 * 60,
    })),
  })

  const isLoading = queries.some((q) => q.isLoading)
  const isError = queries.some((q) => q.isError)
  const errorQuery = queries.find((q) => q.error)
  const firstError = (errorQuery?.error as Error | undefined) ?? null

  const surahSections = useMemo<PageSurahSection[]>(() => {
    if (isLoading || isError) return []

    return queries
      .map((q) => q.data)
      .filter((s): s is SurahDetail => !!s)
      .map((surah) => {
        const startAyah =
          surah.nomor === pageMeta.startSurah ? pageMeta.startAyah : 1
        const endAyah =
          surah.nomor === pageMeta.endSurah
            ? pageMeta.endAyah
            : surah.jumlahAyat
        const ayahs = surah.ayat.filter(
          (a) => a.nomorAyat >= startAyah && a.nomorAyat <= endAyah
        )
        const isSurahStart = startAyah === 1

        return {
          surah,
          startAyah,
          endAyah,
          isSurahStart,
          ayahs,
        }
      })
  }, [queries, isLoading, isError, pageMeta])

  const refetch = () => {
    queries.forEach((q) => q.refetch())
  }

  return {
    pageMeta,
    surahSections,
    isLoading,
    isError,
    error: firstError ?? null,
    refetch,
  }
}
