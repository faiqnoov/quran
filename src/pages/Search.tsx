import { useSearchParams } from "react-router-dom"

export function SearchPage() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get("q") ?? ""

  return (
    <div>
      <h1 className="text-2xl font-bold">Pencarian</h1>
      <p className="mt-2 text-muted-foreground">
        {query
          ? `Hasil pencarian untuk "${query}" akan ditampilkan di sini.`
          : "Masukkan kata kunci untuk mencari surah."}
      </p>
    </div>
  )
}
