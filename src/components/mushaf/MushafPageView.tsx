import { useMemo } from "react"
import { useMushafPage } from "@/hooks/useMushafPage"
import { useSettingsStore, type ArabicFontSize } from "@/store/settingsStore"
import { getPageForAyah, getJuzForPage } from "@/data"
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
}

/**
 * MushafPageView component rendering continuous flowing RTL Arabic text for a mushaf page.
 * Text flows naturally like a physical printed Quran with inline ayah end-markers.
 * Tapping an ayah triggers onAyahClick and applies active visual highlighting.
 */
export function MushafPageView({
  page,
  surah,
  highlightedAyah,
  onAyahClick,
}: MushafPageViewProps) {
  const arabicFontSize = useSettingsStore((s) => s.arabicFontSize)

  const resolvedPage = useMemo(() => {
    if (page && page >= 1 && page <= 604) {
      return page
    }
    if (surah) {
      return getPageForAyah(surah.nomor, 1)
    }
    return 1
  }, [page, surah])

  const {
    surahSections,
    isLoading,
    isError,
    error,
    refetch,
  } = useMushafPage(resolvedPage)

  const juzNumber = useMemo(() => getJuzForPage(resolvedPage), [resolvedPage])

  if (isLoading) {
    return (
      <div className="space-y-6 rounded-2xl border border-border bg-card p-6 shadow-xs">
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="space-y-4 py-4">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-5/6 mr-auto" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-4/5 mr-auto" />
        </div>
      </div>
    )
  }

  if (isError || surahSections.length === 0) {
    return (
      <ErrorState
        message={error?.message || `Gagal memuat halaman ${resolvedPage}.`}
        onRetry={refetch}
      />
    )
  }

  return (
    <div
      id={`mushaf-page-${resolvedPage}`}
      data-testid="mushaf-page-view"
      className="relative rounded-2xl border border-border bg-card p-5 shadow-xs transition-colors sm:p-8"
    >
      {/* Page Header Indicator */}
      <div className="mb-4 flex items-center justify-between border-b border-border/60 pb-3 text-xs text-muted-foreground select-none">
        <span className="font-semibold text-foreground">
          Halaman {resolvedPage}
        </span>
        <span className="font-medium">Juz {juzNumber}</span>
      </div>

      {/* Surah Sections on this Page */}
      <div className="space-y-6">
        {surahSections.map((section) => (
          <div
            key={section.surah.nomor}
            className="space-y-4"
            data-testid={`mushaf-surah-${section.surah.nomor}`}
          >
            {/* If surah begins on this page: render decorative banner & bismillah */}
            {section.isSurahStart && <SurahBanner surah={section.surah} />}

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
                    onClick={() =>
                      onAyahClick?.(section.surah.nomor, ayah.nomorAyat)
                    }
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
        ))}
      </div>
    </div>
  )
}
