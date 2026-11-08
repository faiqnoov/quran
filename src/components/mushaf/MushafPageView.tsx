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
  sm: "text-xl leading-[2.4] sm:text-2xl sm:leading-[2.5]",
  md: "text-2xl leading-[2.5] sm:text-3xl sm:leading-[2.6]",
  lg: "text-3xl leading-[2.7] sm:text-4xl sm:leading-[2.8]",
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
      <div className="space-y-6 rounded-2xl border border-border bg-card p-6 shadow-xs">
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-5 w-16" />
        </div>
        <div className="space-y-4 py-4">
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
      className="relative rounded-2xl border border-border bg-card p-5 shadow-xs transition-colors sm:p-8"
    >
      {/* Mushaf Page Header & Navigation */}
      <MushafPageHeader
        page={resolvedPage}
        surahs={surahs}
        activeSurahNomor={activeSurahNomor}
        onSelectSurah={handleSelectSurah}
        onPageChange={(p) => onPageChange?.(p)}
        className="mb-6"
      />

      {/* Surah Sections on this Page */}
      <div className="space-y-8">
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
              className="space-y-4"
              data-testid={`mushaf-surah-${section.surah.nomor}`}
            >
              {showMidPageBanner && <SurahBanner surah={section.surah} />}

              {showInitialBismillah && (
                <div className="py-2 text-center" dir="rtl" lang="ar">
                  <p className="font-serif text-2xl leading-[2] text-foreground/90 sm:text-3xl">
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
                        "inline cursor-pointer rounded-sm px-1 py-0.5 transition-colors duration-150 outline-none",
                        "hover:bg-primary/10 hover:text-primary focus-visible:ring-1 focus-visible:ring-ring",
                        isHighlighted &&
                          "bg-amber-500/20 text-foreground ring-1 ring-amber-500/40 dark:bg-amber-400/25"
                      )}
                    >
                      <span>{ayah.teksArab}</span>
                      <span
                        className="mx-1.5 inline-flex items-center justify-center font-serif text-[0.8em] font-normal text-primary/80 select-none align-middle"
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
