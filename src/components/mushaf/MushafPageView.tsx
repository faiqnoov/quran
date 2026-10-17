import { useMemo } from "react"
import { getPageForAyah, getJuzForPage, getSurahsOnPage } from "@/data"
import type { SurahDetail } from "@/types/quran"

export interface MushafPageViewProps {
  surah?: SurahDetail
  initialPage?: number
}

/**
 * MushafPageView component for rendering continuous Quranic Arabic text per page.
 * Initial shell created in T6.2; continuous Arabic flow & interactions built in T6.3-T6.5.
 */
export function MushafPageView({ surah, initialPage }: MushafPageViewProps) {
  const pageNumber = useMemo(() => {
    if (initialPage && initialPage >= 1 && initialPage <= 604) {
      return initialPage
    }
    if (surah) {
      return getPageForAyah(surah.nomor, 1)
    }
    return 1
  }, [surah, initialPage])

  const juzNumber = useMemo(() => getJuzForPage(pageNumber), [pageNumber])
  const surahsOnPage = useMemo(() => getSurahsOnPage(pageNumber), [pageNumber])

  return (
    <div
      id={`mushaf-page-${pageNumber}`}
      className="space-y-4 rounded-2xl border border-border bg-card p-6 shadow-xs transition-colors"
      data-testid="mushaf-page-view"
    >
      {/* Page status bar */}
      <div className="flex items-center justify-between border-b border-border/60 pb-3 text-xs text-muted-foreground">
        <span className="font-medium text-foreground">Halaman {pageNumber}</span>
        <span>Juz {juzNumber}</span>
      </div>

      {/* Placeholder / layout shell for continuous Arabic text flow (T6.3) */}
      <div className="py-8 text-center text-muted-foreground">
        <p className="text-sm font-medium text-foreground">Mode Tampilan Mushaf</p>
        <p className="mt-1 text-xs">
          Halaman {pageNumber} (Juz {juzNumber}) • Surah pada halaman ini: {surahsOnPage.join(", ")}
        </p>
      </div>
    </div>
  )
}
