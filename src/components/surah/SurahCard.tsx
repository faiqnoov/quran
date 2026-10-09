import { Link } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import type { SurahMeta } from "@/types/quran"

interface SurahCardProps {
  surah: SurahMeta
}

export function SurahCard({ surah }: SurahCardProps) {
  return (
    <Link
      to={`/surah/${surah.nomor}`}
      aria-label={`Surah ${surah.nomor} ${surah.namaLatin}, ${surah.arti}, ${surah.jumlahAyat} ayat`}
      className="group block rounded-2xl outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
    >
      <Card size="sm" className="h-full transition-colors group-hover:bg-muted/50 sm:py-5">
        <CardContent className="flex items-center gap-3 sm:gap-4">
          {/* Number badge */}
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-sm font-semibold text-primary">
            {surah.nomor}
          </div>

          {/* Latin name + metadata */}
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium text-foreground">
              {surah.namaLatin}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {surah.arti} · {surah.jumlahAyat} ayat · {surah.tempatTurun}
            </p>
          </div>

          {/* Arabic name */}
          <span
            dir="rtl"
            lang="ar"
            className="shrink-0 font-serif text-xl leading-relaxed text-foreground"
          >
            {surah.nama}
          </span>
        </CardContent>
      </Card>
    </Link>
  )
}
