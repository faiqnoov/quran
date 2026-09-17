import { useSurahList } from "@/hooks/useSurahList"
import { SurahList } from "@/components/surah/SurahList"
import { LoadingSkeleton } from "@/components/common/LoadingSkeleton"
import { ErrorState } from "@/components/common/ErrorState"
import { EmptyState } from "@/components/common/EmptyState"

export function HomePage() {
  const { data: surahs, isLoading, isError, error, refetch } = useSurahList()

  return (
    <div className="space-y-6">
      {/* Search bar placeholder — will be replaced in T3 */}
      <div className="flex items-center gap-2 rounded-xl bg-muted/50 px-4 py-3 text-sm text-muted-foreground ring-1 ring-foreground/10">
        Cari surah...
      </div>

      {/* Surah list with loading / error / empty states */}
      {isLoading ? (
        <LoadingSkeleton />
      ) : isError ? (
        <ErrorState
          message={
            error instanceof Error ? error.message : "Gagal memuat daftar surah."
          }
          onRetry={() => void refetch()}
        />
      ) : !surahs || surahs.length === 0 ? (
        <EmptyState message="Tidak ada surah yang ditemukan." />
      ) : (
        <SurahList surahs={surahs} />
      )}
    </div>
  )
}
