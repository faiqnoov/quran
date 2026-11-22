import { useEffect, useRef, useState, type ReactNode } from "react"
import { Bookmark, BookmarkCheck, BookOpenText, Copy, MapPin, Play, Share2 } from "lucide-react"
import { toast } from "sonner"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { useBookmarkStore } from "@/store/bookmarkStore"
import { useLastReadStore } from "@/store/lastReadStore"
import { cn, formatArabicText } from "@/lib/utils"
import type { Ayah, SurahDetail } from "@/types/quran"

export interface MushafAyahSelection {
  surah: SurahDetail
  ayah: Ayah
}

interface MushafAyahSheetProps {
  selection: MushafAyahSelection | null
  onClose: () => void
}

interface ActionRowProps {
  icon: ReactNode
  label: string
  onClick?: () => void
  disabled?: boolean
  hint?: string
}

function ActionRow({ icon, label, onClick, disabled, hint }: ActionRowProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors outline-none",
        "hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring",
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent"
      )}
    >
      <span className="text-primary [&_svg]:size-4" aria-hidden="true">{icon}</span>
      <span className="flex-1 font-medium">{label}</span>
      {hint && <span className="text-[11px] text-muted-foreground">{hint}</span>}
    </button>
  )
}

/**
 * Bottom sheet with actions for a tapped ayah in mushaf mode.
 * Dismissible via backdrop tap, Escape key, close button, or swipe-down.
 */
export function MushafAyahSheet({ selection, onClose }: MushafAyahSheetProps) {
  const [showTranslation, setShowTranslation] = useState(false)
  const touchStartYRef = useRef<number | null>(null)
  const toggleBookmark = useBookmarkStore((s) => s.toggleBookmark)
  const isBookmarked = useBookmarkStore((s) =>
    selection
      ? s.bookmarks.some(
          (b) => b.surahNumber === selection.surah.nomor && b.ayahNumber === selection.ayah.nomorAyat
        )
      : false
  )
  const setLastRead = useLastReadStore((s) => s.setLastRead)

  // Reset expanded translation whenever a different ayah is selected
  useEffect(() => setShowTranslation(false), [selection?.surah.nomor, selection?.ayah.nomorAyat])

  const surah = selection?.surah
  const ayah = selection?.ayah
  const reference = surah && ayah ? `QS. ${surah.namaLatin} ${surah.nomor}: Ayat ${ayah.nomorAyat}` : ""

  function handleCopy() {
    if (!surah || !ayah) return
    const text = [
      formatArabicText(ayah.teksArab),
      "",
      `"${ayah.teksIndonesia}"`,
      "",
      `— QS. ${surah.namaLatin}: ${ayah.nomorAyat}`,
    ].join("\n")
    navigator.clipboard
      .writeText(text)
      .then(() => toast.success("Tersalin ke clipboard", { duration: 2000 }))
      .catch(() => toast.error("Gagal menyalin teks", { duration: 2000 }))
  }

  function handleBookmark() {
    if (!surah || !ayah) return
    toggleBookmark({
      surahNumber: surah.nomor,
      surahName: surah.namaLatin,
      ayahNumber: ayah.nomorAyat,
      snippet: ayah.teksIndonesia.slice(0, 100),
    })
    toast.success(isBookmarked ? "Bookmark dihapus" : "Bookmark disimpan", {
      description: `${surah.namaLatin} : ${ayah.nomorAyat}`,
      duration: 2000,
    })
  }

  function handleLastRead() {
    if (!surah || !ayah) return
    setLastRead({ surahNumber: surah.nomor, surahName: surah.namaLatin, ayahNumber: ayah.nomorAyat })
    toast.success("Ditandai sebagai terakhir baca", { description: `${surah.namaLatin} : ${ayah.nomorAyat}`, duration: 2000 })
  }

  return (
    <Sheet open={!!selection} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="bottom"
        className="mx-auto max-h-[85svh] max-w-2xl gap-0 rounded-t-2xl"
        onTouchStart={(e) => (touchStartYRef.current = e.touches[0].clientY)}
        onTouchEnd={(e) => {
          if (touchStartYRef.current === null) return
          const deltaY = e.changedTouches[0].clientY - touchStartYRef.current
          touchStartYRef.current = null
          if (deltaY > 80) onClose()
        }}
      >
        <div className="mx-auto mt-2 h-1.5 w-12 rounded-full bg-muted" aria-hidden="true" />
        <SheetHeader className="pb-2">
          <SheetTitle>{reference}</SheetTitle>
          <SheetDescription className="sr-only">Pilih aksi untuk ayat ini</SheetDescription>
        </SheetHeader>

        <div className="overflow-y-auto px-2 pb-4">
          {showTranslation && ayah && (
            <div className="mx-2 mb-2 space-y-2 rounded-lg bg-muted/60 p-3">
              <p className="text-sm leading-relaxed text-muted-foreground italic">{ayah.teksLatin}</p>
              <p className="text-sm leading-relaxed text-foreground/90">{ayah.teksIndonesia}</p>
            </div>
          )}
          <ActionRow icon={<Play />} label="Putar Murottal" disabled hint="Segera" />
          <ActionRow
            icon={<BookOpenText />}
            label={showTranslation ? "Sembunyikan Terjemahan" : "Lihat Terjemahan"}
            onClick={() => setShowTranslation((v) => !v)}
          />
          <ActionRow icon={<Share2 />} label="Bagikan Ayat" disabled hint="Segera" />
          <ActionRow icon={<Copy />} label="Salin Ayat" onClick={handleCopy} />
          <ActionRow
            icon={isBookmarked ? <BookmarkCheck /> : <Bookmark />}
            label={isBookmarked ? "Hapus Bookmark" : "Tambah ke Bookmark"}
            onClick={handleBookmark}
          />
          <ActionRow icon={<MapPin />} label="Tandai Terakhir Baca" onClick={handleLastRead} />
        </div>
      </SheetContent>
    </Sheet>
  )
}
