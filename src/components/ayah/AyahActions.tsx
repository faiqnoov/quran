import { Bookmark, BookmarkCheck, Copy } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { useBookmarkStore } from "@/store/bookmarkStore"
import type { Ayah } from "@/types/quran"

interface AyahActionsProps {
  ayah: Ayah
  surahNumber: number
  surahName: string
}

/**
 * Per-ayah action buttons: bookmark toggle and copy-to-clipboard.
 * Icon-only buttons include aria-label for accessibility.
 */
export function AyahActions({ ayah, surahNumber, surahName }: AyahActionsProps) {
  const toggleBookmark = useBookmarkStore((s) => s.toggleBookmark)
  const hasBookmark = useBookmarkStore((s) => s.hasBookmark)

  const isBookmarked = hasBookmark(surahNumber, ayah.nomorAyat)

  function handleToggleBookmark() {
    const wasBookmarked = isBookmarked

    toggleBookmark({
      surahNumber,
      surahName,
      ayahNumber: ayah.nomorAyat,
      snippet: ayah.teksIndonesia.slice(0, 100),
    })

    toast.success(
      wasBookmarked ? "Bookmark dihapus" : "Bookmark disimpan",
      {
        description: `${surahName} : ${ayah.nomorAyat}`,
        duration: 2000,
      },
    )
  }

  async function handleCopy() {
    const text = [
      ayah.teksArab,
      "",
      `"${ayah.teksIndonesia}"`,
      "",
      `— QS. ${surahName}: ${ayah.nomorAyat}`,
    ].join("\n")

    try {
      await navigator.clipboard.writeText(text)
      toast.success("Tersalin ke clipboard", { duration: 2000 })
    } catch {
      toast.error("Gagal menyalin teks", { duration: 2000 })
    }
  }

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={handleToggleBookmark}
        aria-label={
          isBookmarked
            ? `Hapus bookmark ayat ${ayah.nomorAyat}`
            : `Simpan bookmark ayat ${ayah.nomorAyat}`
        }
        className={
          isBookmarked
            ? "text-primary hover:text-primary/80"
            : "text-muted-foreground hover:text-foreground"
        }
      >
        {isBookmarked ? (
          <BookmarkCheck className="size-4" aria-hidden="true" />
        ) : (
          <Bookmark className="size-4" aria-hidden="true" />
        )}
      </Button>

      <Button
        variant="ghost"
        size="icon-sm"
        onClick={handleCopy}
        aria-label={`Salin ayat ${ayah.nomorAyat} ke clipboard`}
        className="text-muted-foreground hover:text-foreground"
      >
        <Copy className="size-4" aria-hidden="true" />
      </Button>
    </div>
  )
}
