import * as React from "react"
import { ChevronDown, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { sanitizeHtml } from "@/lib/sanitize"
import type { SurahDetail } from "@/types/quran"

export interface SurahHeaderProps {
  surah: Pick<
    SurahDetail,
    | "nomor"
    | "nama"
    | "namaLatin"
    | "arti"
    | "jumlahAyat"
    | "tempatTurun"
    | "deskripsi"
  >
}

/**
 * Header section for surah detail page.
 * Displays surah name in Arabic and Latin, meaning, ayah count, revelation place,
 * and a collapsible containing the sanitized HTML description (collapsed by default).
 */
export function SurahHeader({ surah }: SurahHeaderProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  const sanitizedDescription = React.useMemo(() => {
    return sanitizeHtml(surah.deskripsi)
  }, [surah.deskripsi])

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-xs transition-colors">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5">
            <span className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
              {surah.nomor}
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {surah.namaLatin}
            </h1>
          </div>

          <p className="text-sm font-medium text-muted-foreground sm:text-base">
            {surah.arti}
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-muted-foreground">
            <span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 font-medium text-secondary-foreground">
              {surah.tempatTurun}
            </span>
            <span>•</span>
            <span>{surah.jumlahAyat} Ayat</span>
          </div>
        </div>

        <div className="flex sm:justify-end">
          <span
            dir="rtl"
            lang="ar"
            className="text-3xl font-serif text-primary sm:text-4xl"
          >
            {surah.nama}
          </span>
        </div>
      </div>

      {sanitizedDescription && (
        <Collapsible
          open={isOpen}
          onOpenChange={setIsOpen}
          className="mt-5 border-t border-border/60 pt-4"
        >
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 px-2 text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              <Info className="size-3.5 text-primary" aria-hidden="true" />
              <span>{isOpen ? "Sembunyikan Deskripsi" : "Tentang Surah"}</span>
              <ChevronDown
                aria-hidden="true"
                className={`size-3.5 transition-transform duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3 overflow-hidden transition-all">
            <div
              className="rounded-xl bg-muted/40 p-4 text-sm leading-relaxed text-muted-foreground break-words [&_p]:mb-2 [&_p:last-child]:mb-0 [&_i]:italic [&_b]:font-semibold [&_strong]:font-semibold"
              dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
            />
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  )
}
