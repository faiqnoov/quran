import type { SurahMeta } from "@/types/quran"

export interface SurahBannerProps {
  surah: Pick<SurahMeta, "nomor" | "nama" | "tempatTurun" | "jumlahAyat">
}

/**
 * Ornamental Surah Header Banner displayed when a surah begins on a mushaf page.
 * Includes surah Arabic name in ornamental frame, revelation place, ayah count,
 * and bismillah (except surahs 1 and 9).
 */
export function SurahBanner({ surah }: SurahBannerProps) {
  // Surah 1 has Bismillah as Ayah 1; Surah 9 (At-Tawbah) has no Bismillah
  const showBismillah = surah.nomor !== 1 && surah.nomor !== 9

  return (
    <div
      className="my-6 space-y-3 select-none"
      data-testid={`surah-banner-${surah.nomor}`}
    >
      {/* Decorative Surah Banner Frame */}
      <div className="relative flex items-center justify-between rounded-xl border-2 border-primary/30 bg-primary/5 px-4 py-2.5 shadow-2xs dark:border-primary/40 dark:bg-primary/10">
        {/* Left: Revelation place */}
        <span className="text-xs font-semibold tracking-wider text-muted-foreground">
          {surah.tempatTurun}
        </span>

        {/* Center: Ornamental Frame with Surah Arabic Calligraphy */}
        <div className="flex items-center justify-center rounded-full border border-primary/40 bg-background/90 px-6 py-1 shadow-xs">
          <span
            dir="rtl"
            lang="ar"
            className="font-serif text-2xl font-bold text-primary sm:text-3xl"
          >
            {surah.nama}
          </span>
        </div>

        {/* Right: Ayah count */}
        <span className="text-xs font-semibold tracking-wider text-muted-foreground">
          {surah.jumlahAyat} Ayat
        </span>
      </div>

      {/* Bismillah */}
      {showBismillah && (
        <div className="py-2 text-center" dir="rtl" lang="ar">
          <p className="font-serif text-2xl leading-[2] text-foreground/90 sm:text-3xl">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>
        </div>
      )}
    </div>
  )
}
