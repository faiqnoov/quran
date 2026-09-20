import { useParams } from "react-router-dom"
import { useSurahDetail } from "@/hooks/useSurahDetail"
import { SurahHeader } from "@/components/surah/SurahHeader"
import { ErrorState } from "@/components/common/ErrorState"
import { Skeleton } from "@/components/ui/skeleton"

export function SurahDetailPage() {
  const { nomor } = useParams<{ nomor: string }>()
  const { data: surah, isLoading, isError, error, refetch } = useSurahDetail()

  if (isLoading) {
    return (
      <div className="space-y-6">
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
    </div>
  )
}


