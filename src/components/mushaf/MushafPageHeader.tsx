import { useMemo } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getJuzForPage } from "@/data"
import { cn } from "@/lib/utils"
import type { SurahDetail } from "@/types/quran"

export interface MushafPageHeaderProps {
  page: number // 1–604
  surahs: SurahDetail[]
  activeSurahNomor?: number
  onSelectSurah?: (surahNomor: number) => void
  onPageChange: (newPage: number) => void
  className?: string
}

/**
 * MushafPageHeader component displaying:
 * - Page & Juz indicators with previous/next page navigation buttons
 * - Multi-surah tabs when a page contains multiple surahs
 * - Ornamental surah info banner (Arabic name in ornate frame, place, ayah count)
 */
export function MushafPageHeader({
  page,
  surahs,
  activeSurahNomor,
  onSelectSurah,
  onPageChange,
  className,
}: MushafPageHeaderProps) {
  const juzNumber = useMemo(() => getJuzForPage(page), [page])

  const activeSurah = useMemo(() => {
    if (!surahs.length) return null
    return (
      surahs.find((s) => s.nomor === activeSurahNomor) ?? surahs[0]
    )
  }, [surahs, activeSurahNomor])

  const hasPrev = page > 1
  const hasNext = page < 604
  const hasMultipleSurahs = surahs.length > 1

  return (
    <div className={cn("space-y-4 select-none", className)}>
      {/* Top Navigation Bar: RTL Mushaf style (Next page on left ←, Prev page on right →) */}
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <div className="w-24">
          {hasNext ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onPageChange(page + 1)}
              aria-label="Halaman selanjutnya"
              className="flex items-center gap-1 px-2 text-xs text-muted-foreground hover:text-foreground"
            >
              <ChevronLeft className="size-4" aria-hidden="true" />
              <span className="hidden sm:inline">Hal. {page + 1}</span>
            </Button>
          ) : (
            <div className="size-8" />
          )}
        </div>

        <div className="flex flex-col items-center justify-center text-center">
          <h2 className="text-base font-bold tracking-tight text-foreground sm:text-lg">
            Halaman {page}
          </h2>
          <span className="text-xs font-medium text-muted-foreground">
            Juz {juzNumber}
          </span>
        </div>

        <div className="flex w-24 justify-end">
          {hasPrev ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onPageChange(page - 1)}
              aria-label="Halaman sebelumnya"
              className="flex items-center gap-1 px-2 text-xs text-muted-foreground hover:text-foreground"
            >
              <span className="hidden sm:inline">Hal. {page - 1}</span>
              <ChevronRight className="size-4" aria-hidden="true" />
            </Button>
          ) : (
            <div className="size-8" />
          )}
        </div>
      </div>

      {/* Multi-surah tabs (shown only if page contains ayahs from 2+ surahs) */}
      {hasMultipleSurahs && (
        <div
          role="tablist"
          aria-label="Daftar surah pada halaman ini"
          className="flex items-center gap-1.5 overflow-x-auto py-1"
        >
          {surahs.map((surah) => {
            const isSelected = activeSurah?.nomor === surah.nomor
            return (
              <button
                key={surah.nomor}
                role="tab"
                aria-selected={isSelected}
                onClick={() => onSelectSurah?.(surah.nomor)}
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap transition-all",
                  "focus-visible:ring-2 focus-visible:ring-ring outline-none",
                  isSelected
                    ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                    : "bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <span>{surah.nomor}.</span>
                <span>{surah.namaLatin}</span>
              </button>
            )
          })}
        </div>
      )}

      {/* Surah Info Banner below the header */}
      {activeSurah && (
        <div
          data-testid="mushaf-header-surah-banner"
          className="relative flex items-center justify-between rounded-xl border-2 border-primary/30 bg-primary/5 px-4 py-2.5 shadow-2xs dark:border-primary/40 dark:bg-primary/10"
        >
          <span className="text-xs font-semibold tracking-wider text-muted-foreground">
            {activeSurah.tempatTurun}
          </span>

          <div className="flex items-center justify-center rounded-full border border-primary/40 bg-background/90 px-6 py-1 shadow-xs">
            <span
              dir="rtl"
              lang="ar"
              className="font-serif text-2xl font-bold text-primary sm:text-3xl"
            >
              {activeSurah.nama}
            </span>
          </div>

          <span className="text-xs font-semibold tracking-wider text-muted-foreground">
            {activeSurah.jumlahAyat} Ayat
          </span>
        </div>
      )}
    </div>
  )
}
