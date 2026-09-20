import { useEffect, useState } from "react"
import { useParams, useSearchParams } from "react-router-dom"
import { useSurahDetail } from "@/hooks/useSurahDetail"
import { SurahHeader } from "@/components/surah/SurahHeader"
import { AyahItem } from "@/components/ayah/AyahItem"
import { BismillahHeader } from "@/components/ayah/BismillahHeader"
import { SurahNavigation } from "@/components/surah/SurahNavigation"
import { ErrorState } from "@/components/common/ErrorState"
import { Skeleton } from "@/components/ui/skeleton"

export function SurahDetailPage() {
  const { nomor } = useParams<{ nomor: string }>()
  const [searchParams] = useSearchParams()
  const { data: surah, isLoading, isError, error, refetch } = useSurahDetail()

  const ayatParam = searchParams.get("ayat")
  const targetAyat = ayatParam ? Number(ayatParam) : null
  const [highlightedAyat, setHighlightedAyat] = useState<number | null>(null)

  // Scroll to the target ayah once data is loaded
  useEffect(() => {
    if (!surah || !targetAyat) return
    if (targetAyat < 1 || targetAyat > surah.jumlahAyat) return

    // Wait a tick for DOM to render the ayah elements
    const timeout = setTimeout(() => {
      const el = document.getElementById(`ayah-${targetAyat}`)
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" })
        setHighlightedAyat(targetAyat)

        // Clear the highlight after the animation (2s) completes
        const clearTimer = setTimeout(() => setHighlightedAyat(null), 2500)
        return () => clearTimeout(clearTimer)
      }
    }, 100)

    return () => clearTimeout(timeout)
  }, [surah, targetAyat])

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Header skeleton */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-xs">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Skeleton className="size-7 rounded-lg" />
                <Skeleton className="h-7 w-36" />
              </div>
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-3 w-44" />
            </div>
            <Skeleton className="h-10 w-24" />
          </div>
        </div>

        {/* Ayah list skeleton */}
        <div className="space-y-0 divide-y divide-border/50">
          {Array.from({ length: 5 }, (_, i) => (
            <div key={i} className="py-6 space-y-4">
              <Skeleton className="size-8 rounded-full" />
              <Skeleton className="ml-auto h-8 w-4/5" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (isError || !surah) {
    return (
      <ErrorState
        message={error?.message || `Gagal memuat detail surah ${nomor}.`}
        onRetry={refetch}
      />
    )
  }

  return (
    <div className="space-y-6">
      <SurahHeader surah={surah} />

      <div>
        <BismillahHeader surahNomor={surah.nomor} />

        <div>
          {surah.ayat.map((ayah) => (
            <AyahItem
              key={ayah.nomorAyat}
              ayah={ayah}
              surahNomor={surah.nomor}
              isHighlighted={highlightedAyat === ayah.nomorAyat}
            />
          ))}
        </div>
      </div>

      <SurahNavigation
        prev={surah.suratSebelumnya}
        next={surah.suratSelanjutnya}
      />
    </div>
  )
}




