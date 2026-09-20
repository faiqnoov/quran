import type { Ayah } from "@/types/quran"

interface AyahItemProps {
  ayah: Ayah
  surahNomor: number
}

/**
 * Renders a single ayah with number marker, Arabic text (RTL),
 * latin transliteration, and Indonesian translation.
 *
 * Arabic text uses line-height ≥ 2 and min 24px on mobile to
 * ensure readability and proper diacritic rendering.
 * Text is never truncated or transformed.
 */
export function AyahItem({ ayah, surahNomor }: AyahItemProps) {
  return (
    <article
      id={`ayah-${ayah.nomorAyat}`}
      className="group scroll-mt-20 border-b border-border/50 py-6 last:border-b-0"
    >
      {/* Ayah number marker */}
      <div className="mb-4 flex items-center gap-3">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
          {surahNomor}:{ayah.nomorAyat}
        </span>
      </div>

      {/* Arabic text — RTL, generous line-height, never truncated */}
      <p
        dir="rtl"
        lang="ar"
        className="mb-4 text-right font-serif text-2xl leading-[2.2] text-foreground sm:text-3xl sm:leading-[2.2]"
      >
        {ayah.teksArab}
      </p>

      {/* Latin transliteration */}
      <p className="mb-2 text-sm leading-relaxed text-muted-foreground italic">
        {ayah.teksLatin}
      </p>

      {/* Indonesian translation */}
      <p className="text-sm leading-relaxed text-foreground/80">
        {ayah.teksIndonesia}
      </p>
    </article>
  )
}
