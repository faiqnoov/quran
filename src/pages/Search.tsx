import { useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { SearchBar } from "@/components/common/SearchBar"
import { SurahList } from "@/components/surah/SurahList"
import { EmptyState } from "@/components/common/EmptyState"
import { useSearch } from "@/hooks/useSearch"

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get("q") || ""
  const navigate = useNavigate()

  const { results, directNavIntent } = useSearch(query)

  // Handle direct navigation intent (e.g. "2:255")
  useEffect(() => {
    if (directNavIntent) {
      navigate(directNavIntent, { replace: true })
    }
  }, [directNavIntent, navigate])

  const handleSearchChange = (value: string) => {
    if (value) {
      setSearchParams({ q: value }, { replace: true })
    } else {
      setSearchParams({}, { replace: true })
    }
  }

  const handleClear = () => {
    setSearchParams({}, { replace: true })
  }

  return (
    <div className="space-y-6">
      <h1 className="sr-only">Pencarian Al-Qur'an</h1>
      <SearchBar
        value={query}
        onChange={handleSearchChange}
        onClear={handleClear}
        autoFocus
      />

      <div>
        {!query ? (
          <EmptyState message="Ketik nama surah, nomor surah, arti, atau ayat (contoh: 2:255)." />
        ) : results.length === 0 ? (
          <EmptyState message={`Tidak ditemukan hasil untuk "${query}".`} />
        ) : (
          <div className="space-y-4">
            <h2 className="text-sm font-medium text-muted-foreground px-1">
              Ditemukan {results.length} surah
            </h2>
            <SurahList surahs={results} />
          </div>
        )}
      </div>
    </div>
  )
}
