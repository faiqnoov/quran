import { Link } from "react-router-dom"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { SurahNav } from "@/types/quran"

interface SurahNavigationProps {
  prev: SurahNav | false
  next: SurahNav | false
}

/**
 * Prev/next surah navigation bar at the bottom of the surah detail page.
 * Hides the "previous" button for surah 1 and "next" for surah 114
 * (when the API returns `false`).
 */
export function SurahNavigation({ prev, next }: SurahNavigationProps) {
  if (!prev && !next) return null

  return (
    <nav
      aria-label="Navigasi surah"
      className="flex items-center justify-between gap-4 border-t border-border pt-6"
    >
      {/* Previous surah */}
      {prev ? (
        <Button variant="outline" size="sm" asChild>
          <Link to={`/surah/${prev.nomor}`} className="gap-2">
            <ChevronLeft className="size-4" />
            <span className="flex flex-col items-start text-left">
              <span className="text-[10px] font-normal text-muted-foreground">
                Sebelumnya
              </span>
              <span className="text-xs font-medium">{prev.namaLatin}</span>
            </span>
          </Link>
        </Button>
      ) : (
        <div />
      )}

      {/* Next surah */}
      {next ? (
        <Button variant="outline" size="sm" asChild>
          <Link to={`/surah/${next.nomor}`} className="gap-2">
            <span className="flex flex-col items-end text-right">
              <span className="text-[10px] font-normal text-muted-foreground">
                Selanjutnya
              </span>
              <span className="text-xs font-medium">{next.namaLatin}</span>
            </span>
            <ChevronRight className="size-4" />
          </Link>
        </Button>
      ) : (
        <div />
      )}
    </nav>
  )
}
