import { Link } from "react-router-dom"
import { Trash2, ArrowRight, BookmarkCheck } from "lucide-react"
import { toast } from "sonner"
import { useBookmarkStore, type Bookmark } from "@/store/bookmarkStore"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { EmptyState } from "@/components/common/EmptyState"

function BookmarkItem({ bookmark }: { bookmark: Bookmark }) {
  const removeBookmark = useBookmarkStore((s) => s.removeBookmark)

  function handleRemove() {
    removeBookmark(bookmark.surahNumber, bookmark.ayahNumber)
    toast.success("Bookmark dihapus", {
      description: `${bookmark.surahName} : ${bookmark.ayahNumber}`,
      duration: 2000,
    })
  }

  return (
    <Card size="sm">
      <CardContent>
        <div className="flex items-start gap-3">
          {/* Jump link — takes most of the row */}
          <Link
            to={`/surah/${bookmark.surahNumber}?ayat=${bookmark.ayahNumber}`}
            className="min-w-0 flex-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
          >
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                {bookmark.surahNumber}:{bookmark.ayahNumber}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-foreground">
                  {bookmark.surahName}
                </p>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">
                  {bookmark.snippet}
                </p>
              </div>
              <ArrowRight className="mt-1 size-4 shrink-0 text-muted-foreground" />
            </div>
          </Link>

          {/* Remove button */}
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={handleRemove}
            aria-label={`Hapus bookmark ${bookmark.surahName} ayat ${bookmark.ayahNumber}`}
            className="shrink-0 text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export function BookmarksPage() {
  const bookmarks = useBookmarkStore((s) => s.bookmarks)
  const clearAll = useBookmarkStore((s) => s.clearAll)

  // Show newest bookmarks first
  const sorted = [...bookmarks].sort((a, b) => b.createdAt - a.createdAt)

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <BookmarkCheck className="size-5 text-primary" />
          <h1 className="text-xl font-bold text-foreground">Bookmark</h1>
        </div>
        {bookmarks.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              clearAll()
              toast.success("Semua bookmark dihapus", { duration: 2000 })
            }}
            className="text-muted-foreground hover:text-destructive"
          >
            Hapus Semua
          </Button>
        )}
      </div>

      {/* Bookmark list or empty state */}
      {sorted.length === 0 ? (
        <EmptyState message="Belum ada ayat yang ditandai. Tandai ayat favorit saat membaca surah." />
      ) : (
        <div className="space-y-3">
          {sorted.map((bookmark) => (
            <BookmarkItem
              key={`${bookmark.surahNumber}-${bookmark.ayahNumber}`}
              bookmark={bookmark}
            />
          ))}
        </div>
      )}
    </div>
  )
}
