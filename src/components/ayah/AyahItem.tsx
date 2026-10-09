import type { Ayah } from "@/types/quran"
import { AyahActions } from "@/components/ayah/AyahActions"
import { useSettingsStore, type ArabicFontSize } from "@/store/settingsStore"

interface AyahItemProps {
  ayah: Ayah
  surahNomor: number
  surahName: string
  /** When true, applies a brief highlight pulse animation (used for deep-links). */
  isHighlighted?: boolean
}

const ARABIC_SIZE_CLASSES: Record<ArabicFontSize, string> = {
  sm: "text-2xl leading-[2.2] sm:text-2xl sm:leading-[2.2]",
  md: "text-3xl leading-[2.2] sm:text-3xl sm:leading-[2.2]",
  lg: "text-4xl leading-[2.2] sm:text-4xl sm:leading-[2.2]",
}

/**
 * Renders a single ayah with number marker, Arabic text (RTL),
 * latin transliteration, and Indonesian translation.
 *
 * Arabic text uses line-height ≥ 2 and min 24px on mobile to
 * ensure readability and proper diacritic rendering.
 * Text is never truncated or transformed.
 */
export function AyahItem({ ayah, surahNomor, surahName, isHighlighted }: AyahItemProps) {
  const arabicFontSize = useSettingsStore((s) => s.arabicFontSize)
  const showLatin = useSettingsStore((s) => s.showLatin)
  const showTranslation = useSettingsStore((s) => s.showTranslation)

  return (
    <article
      id={`ayah-${ayah.nomorAyat}`}
      className={`group scroll-mt-20 border-b border-border/50 py-6 last:border-b-0 ${
        isHighlighted
          ? "animate-ayah-highlight rounded-xl -mx-2 px-2 sm:-mx-3 sm:px-3"
          : ""
      }`}
    >
      {/* Ayah number marker + actions */}
      <div className="mb-4 flex items-center justify-between gap-3">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
          {surahNomor}:{ayah.nomorAyat}
        </span>
        <AyahActions
          ayah={ayah}
          surahNumber={surahNomor}
          surahName={surahName}
        />
      </div>

      {/* Arabic text — RTL, generous line-height, never truncated */}
      <p
        dir="rtl"
        lang="ar"
        className={`mb-4 text-right font-serif text-foreground break-words transition-all duration-150 ${
          ARABIC_SIZE_CLASSES[arabicFontSize] || ARABIC_SIZE_CLASSES.md
        }`}
      >
        {ayah.teksArab}
      </p>

      {/* Latin transliteration */}
      {showLatin && (
        <p className="mb-2 text-sm leading-relaxed text-muted-foreground italic break-words">
          {ayah.teksLatin}
        </p>
      )}

      {/* Indonesian translation */}
      {showTranslation && (
        <p className="text-sm leading-relaxed text-foreground/80 break-words">
          {ayah.teksIndonesia}
        </p>
      )}
    </article>
  )
}

