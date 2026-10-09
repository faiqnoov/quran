import { useNavigate } from "react-router-dom"
import { useSurahList } from "@/hooks/useSurahList"
import { SurahList } from "@/components/surah/SurahList"
import { LoadingSkeleton } from "@/components/common/LoadingSkeleton"
import { ErrorState } from "@/components/common/ErrorState"
import { EmptyState } from "@/components/common/EmptyState"
import { SearchBar } from "@/components/common/SearchBar"
import { ContinueReadingCard } from "@/components/common/ContinueReadingCard"

export function HomePage() {
  const { data: surahs, isLoading, isError, error, refetch } = useSurahList()
  const navigate = useNavigate()

  return (
    <div className="space-y-6">
      <h1 className="sr-only">Al-Qur'an Digital - Baca dan Cari Surah</h1>
      <SearchBar
        value=""
        onChange={(val) => {
          if (val.trim()) {
            navigate(`/search?q=${encodeURIComponent(val)}`)
          }
        }}
      />

      <ContinueReadingCard />

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

