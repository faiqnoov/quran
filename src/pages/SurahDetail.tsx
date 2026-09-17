import { useParams } from "react-router-dom"

export function SurahDetailPage() {
  const { nomor } = useParams<{ nomor: string }>()

  return (
    <div>
      <h1 className="text-2xl font-bold">Surah {nomor}</h1>
      <p className="mt-2 text-muted-foreground">
        Detail surah akan ditampilkan di sini.
      </p>
    </div>
  )
}
