import type { SurahMeta } from "@/types/quran"
import { SurahCard } from "./SurahCard"

interface SurahListProps {
  surahs: SurahMeta[]
}

export function SurahList({ surahs }: SurahListProps) {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
      {surahs.map((surah) => (
        <SurahCard key={surah.nomor} surah={surah} />
      ))}
    </div>
  )
}
