/**
 * Renders the Bismillah header ("بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ")
 * shown at the top of every surah except Al-Fatihah (1) and At-Tawbah (9).
 *
 * - Surah 1: Bismillah is already part of its first ayah.
 * - Surah 9: Historically has no Bismillah.
 */

const BISMILLAH_TEXT = "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ"

/** Surahs that should NOT show the Bismillah header. */
const EXCLUDED_SURAHS = new Set([1, 9])

interface BismillahHeaderProps {
  surahNomor: number
}

export function BismillahHeader({ surahNomor }: BismillahHeaderProps) {
  if (EXCLUDED_SURAHS.has(surahNomor)) {
    return null
  }

  return (
    <div className="flex items-center justify-center py-8">
      <p
        dir="rtl"
        lang="ar"
        className="text-center font-serif text-2xl leading-[2] text-foreground sm:text-3xl"
      >
        {BISMILLAH_TEXT}
      </p>
    </div>
  )
}
