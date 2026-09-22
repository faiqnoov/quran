import { Link } from "react-router-dom"
import { BookOpen, ArrowRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useLastReadStore } from "@/store/lastReadStore"

/**
 * Displays a "continue reading" card on the Home page when
 * a last-read position exists. Links directly to the saved ayah.
 */
export function ContinueReadingCard() {
  const lastRead = useLastReadStore((s) => s.lastRead)

  if (!lastRead) return null

  return (
    <Link
      to={`/surah/${lastRead.surahNumber}?ayat=${lastRead.ayahNumber}`}
      className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-2xl"
    >
      <Card className="bg-primary/5 ring-primary/20 transition-colors hover:bg-primary/10">
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <BookOpen className="size-5 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-muted-foreground">
                Lanjutkan membaca
              </p>
              <p className="truncate font-semibold text-foreground">
                {lastRead.surahName}
              </p>
              <p className="text-xs text-muted-foreground">
                Ayat {lastRead.ayahNumber}
              </p>
            </div>
            <ArrowRight className="size-4 shrink-0 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
