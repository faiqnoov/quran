import { useMemo, useRef, useState } from "react"
import { useMushafPage } from "@/hooks/useMushafPage"
import { useSettingsStore, type ArabicFontSize } from "@/store/settingsStore"
import { getPageForAyah } from "@/data"
import { MushafPageHeader } from "./MushafPageHeader"
import { SurahBanner } from "./SurahBanner"
import { toArabicDigits, cn } from "@/lib/utils"
import { ErrorState } from "@/components/common/ErrorState"
import { Skeleton } from "@/components/ui/skeleton"
import type { SurahDetail } from "@/types/quran"

const MUSHAF_FONT_CLASSES: Record<ArabicFontSize, string> = {
  sm: "text-lg leading-[1.85] sm:text-xl sm:leading-[1.9]",
  md: "text-xl leading-[1.9] sm:text-[22px] sm:leading-[1.95]",
  lg: "text-2xl leading-[2.0] sm:text-2xl sm:leading-[2.05]",
}

export interface MushafPageViewProps {
  page?: number
  surah?: SurahDetail
  highlightedAyah?: { surah: number; ayah: number } | null
  onAyahClick?: (surah: number, ayah: number) => void
  onPageChange?: (newPage: number) => void
}

/**
 * MushafPageView component rendering continuous flowing RTL Arabic text for a mushaf page.
 * Text flows naturally like a physical printed Quran with inline ayah end-markers.
 * Includes page-level header navigation and multi-surah tabs (T6.4).
 */
export function MushafPageView({
  page,
  surah,
  highlightedAyah,
  onAyahClick,
  onPageChange,
}: MushafPageViewProps) {
  const arabicFontSize = useSettingsStore((s) => s.arabicFontSize)
  const [activeSurahNomor, setActiveSurahNomor] = useState<number | undefined>(
    undefined
  )

  const resolvedPage = useMemo(() => {
    if (page && page >= 1 && page <= 604) {
      return page
    }
    if (surah) {
      return getPageForAyah(surah.nomor, 1)
    }
    return 1
  }, [page, surah])

  const { surahSections, isLoading, isError, error, refetch } =
    useMushafPage(resolvedPage)

  const surahs = useMemo(
    () => surahSections.map((s) => s.surah),
    [surahSections]
  )

  const touchStartXRef = useRef<number | null>(null)
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX
  }
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return
    const deltaX = e.changedTouches[0].clientX - touchStartXRef.current
    touchStartXRef.current = null
    if (deltaX < -60 && resolvedPage < 604) onPageChange?.(resolvedPage + 1)
    else if (deltaX > 60 && resolvedPage > 1) onPageChange?.(resolvedPage - 1)
  }

  const handleSelectSurah = (nomor: number) => {
    setActiveSurahNomor(nomor)
    document.getElementById(`mushaf-surah-${nomor}`)?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  if (isLoading) {
    return (
      <div className="space-y-3 rounded-xl border border-border bg-card p-3 shadow-xs sm:px-5 sm:py-3.5">
        <div className="flex items-center justify-between border-b border-border/60 pb-2">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-5 w-16" />
        </div>
        <div className="space-y-3 py-2">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-5/6 mr-auto" />
        </div>
      </div>
    )
  }

  if (isError || surahSections.length === 0) {
    return <ErrorState message={error?.message || `Gagal memuat halaman ${resolvedPage}.`} onRetry={refetch} />
  }

  return (
    <div
      id={`mushaf-page-${resolvedPage}`}
      data-testid="mushaf-page-view"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative rounded-xl border border-border bg-card p-3 shadow-xs transition-colors sm:px-5 sm:py-3.5"
    >
      {/* Mushaf Page Header & Navigation */}
      <MushafPageHeader
        page={resolvedPage}
        surahs={surahs}
        activeSurahNomor={activeSurahNomor}
        onSelectSurah={handleSelectSurah}
        onPageChange={(p) => onPageChange?.(p)}
        className="mb-2"
      />

      {/* Surah Sections on this Page */}
      <div className="space-y-2.5">
        {surahSections.map((section, idx) => {
          const showInitialBismillah =
            idx === 0 &&
            section.isSurahStart &&
            section.surah.nomor !== 1 &&
            section.surah.nomor !== 9
          const showMidPageBanner = idx > 0 && section.isSurahStart

          return (
            <div
              key={section.surah.nomor}
              id={`mushaf-surah-${section.surah.nomor}`}
              className="space-y-1"
              data-testid={`mushaf-surah-${section.surah.nomor}`}
            >
              {showMidPageBanner && <SurahBanner surah={section.surah} />}

              {showInitialBismillah && (
                <div className="py-0.5 text-center" dir="rtl" lang="ar">
                  <p className="font-serif text-lg leading-snug text-foreground/90 sm:text-xl">
                    بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                  </p>
                </div>
              )}

              {/* Continuous RTL Flowing Text */}
              <div
                dir="rtl"
                lang="ar"
                className={cn(
                  "font-serif text-foreground break-normal text-justify",
                  MUSHAF_FONT_CLASSES[arabicFontSize]
                )}
              >
                {section.ayahs.map((ayah) => {
                  const isHighlighted =
                    highlightedAyah?.surah === section.surah.nomor &&
                    highlightedAyah?.ayah === ayah.nomorAyat

                  return (
                    <span
                      key={ayah.nomorAyat}
                      id={`ayah-${ayah.nomorAyat}`}
                      data-ayah={ayah.nomorAyat}
                      data-surah={section.surah.nomor}
                      role="button"
                      tabIndex={0}
                      aria-label={`QS. ${section.surah.namaLatin} Ayat ${ayah.nomorAyat}`}
                      onClick={() => onAyahClick?.(section.surah.nomor, ayah.nomorAyat)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault()
                          onAyahClick?.(section.surah.nomor, ayah.nomorAyat)
                        }
                      }}
                      className={cn(
                        "inline cursor-pointer rounded-sm px-0.5 py-0.5 transition-colors duration-150 outline-none",
                        "hover:bg-primary/10 hover:text-primary focus-visible:ring-1 focus-visible:ring-ring",
                        isHighlighted &&
                          "bg-amber-500/20 text-foreground ring-1 ring-amber-500/40 dark:bg-amber-400/25"
                      )}
                    >
                      <span>{ayah.teksArab}</span>
                      <span
                        className="mx-1 inline-flex items-center justify-center font-serif text-[0.75em] font-normal text-primary/80 select-none align-middle"
                        aria-hidden="true"
                      >
                        ﴿{toArabicDigits(ayah.nomorAyat)}﴾
                      </span>{" "}
                    </span>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
