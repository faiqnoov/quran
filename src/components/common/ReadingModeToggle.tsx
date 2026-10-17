import { List, BookOpen } from "lucide-react"
import { useSettingsStore, type ReadingMode } from "@/store/settingsStore"
import { cn } from "@/lib/utils"

export interface ReadingModeToggleProps {
  className?: string
  showLabels?: boolean
}

/**
 * Toggle button allowing switching between Ayah list mode and Mushaf page mode.
 * Accessible with role="group" and aria-pressed attributes.
 */
export function ReadingModeToggle({
  className,
  showLabels = true,
}: ReadingModeToggleProps) {
  const readingMode = useSettingsStore((s) => s.readingMode)
  const setReadingMode = useSettingsStore((s) => s.setReadingMode)

  const handleSelectMode = (mode: ReadingMode) => {
    if (readingMode !== mode) {
      setReadingMode(mode)
    }
  }

  return (
    <div
      role="group"
      aria-label="Pilih mode bacaan"
      className={cn(
        "inline-flex items-center rounded-xl border border-border/80 bg-muted/60 p-1 text-xs shadow-2xs backdrop-blur-xs",
        className
      )}
    >
      <button
        type="button"
        id="mode-ayah-toggle"
        onClick={() => handleSelectMode("ayah")}
        aria-pressed={readingMode === "ayah"}
        aria-label="Mode Ayat (Daftar Ayat)"
        title="Mode Ayat (Daftar)"
        className={cn(
          "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-medium transition-all duration-150 outline-none",
          "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
          readingMode === "ayah"
            ? "bg-background text-foreground shadow-xs font-semibold"
            : "text-muted-foreground hover:text-foreground hover:bg-background/40"
        )}
      >
        <List className="size-3.5" aria-hidden="true" />
        {showLabels && <span>Ayat</span>}
      </button>

      <button
        type="button"
        id="mode-mushaf-toggle"
        onClick={() => handleSelectMode("mushaf")}
        aria-pressed={readingMode === "mushaf"}
        aria-label="Mode Mushaf (Per Halaman)"
        title="Mode Mushaf (Halaman)"
        className={cn(
          "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-medium transition-all duration-150 outline-none",
          "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
          readingMode === "mushaf"
            ? "bg-background text-foreground shadow-xs font-semibold"
            : "text-muted-foreground hover:text-foreground hover:bg-background/40"
        )}
      >
        <BookOpen className="size-3.5" aria-hidden="true" />
        {showLabels && <span>Mushaf</span>}
      </button>
    </div>
  )
}
