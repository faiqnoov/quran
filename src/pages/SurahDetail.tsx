import { useParams } from "react-router-dom"
import { useSurahDetail } from "@/hooks/useSurahDetail"

export function SurahDetailPage() {
  const { nomor } = useParams<{ nomor: string }>()
  const { data: surah, isLoading } = useSurahDetail()

  return (
    <div>
      <h1 className="text-2xl font-bold">
        {surah ? `${surah.nomor}. ${surah.namaLatin}` : `Surah ${nomor}`}
      </h1>
      <p className="mt-2 text-muted-foreground">
        {isLoading ? "Memuat..." : surah ? `${surah.arti} • ${surah.jumlahAyat} Ayat` : "Detail surah akan ditampilkan di sini."}
      </p>
    </div>
  )
}

