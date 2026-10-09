import { SlidersHorizontal, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  useSettingsStore,
  type ArabicFontSize,
} from "@/store/settingsStore"

const FONT_SIZE_OPTIONS: {
  value: ArabicFontSize
  label: string
  detail: string
}[] = [
  { value: "sm", label: "Kecil", detail: "24px" },
  { value: "md", label: "Sedang", detail: "30px" },
  { value: "lg", label: "Besar", detail: "36px" },
]

const PREVIEW_ARABIC_CLASSES: Record<ArabicFontSize, string> = {
  sm: "text-2xl leading-[2.2]",
  md: "text-3xl leading-[2.2]",
  lg: "text-4xl leading-[2.2]",
}

export function ReadingSettingsSheet() {
  const {
    arabicFontSize,
    showLatin,
    showTranslation,
    setArabicFontSize,
    setShowLatin,
    setShowTranslation,
  } = useSettingsStore()

  const handleResetDefaults = () => {
    setArabicFontSize("md")
    setShowLatin(true)
    setShowTranslation(true)
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          id="reading-settings-trigger"
          variant="ghost"
          size="icon"
          aria-label="Pengaturan tampilan bacaan"
          className="h-9 w-9 text-muted-foreground hover:text-foreground"
        >
          <SlidersHorizontal className="h-4 w-4" />
        </Button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="w-full sm:max-w-md data-[side=right]:w-full sm:data-[side=right]:max-w-md overflow-y-auto"
        aria-describedby="reading-settings-desc"
      >
        <SheetHeader className="border-b border-border/60 pb-4">
          <SheetTitle className="text-lg font-semibold text-foreground">
            Pengaturan Bacaan
          </SheetTitle>
          <SheetDescription id="reading-settings-desc" className="text-xs text-muted-foreground">
            Sesuaikan ukuran huruf dan tampilan ayat Al-Qur'an agar nyaman dibaca.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 px-6 py-6">
          {/* Section 1: Arabic Font Size */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label id="font-size-label" className="text-sm font-medium text-foreground">
                Ukuran Tulisan Arab
              </label>
              <span className="text-xs text-muted-foreground">
                {FONT_SIZE_OPTIONS.find((o) => o.value === arabicFontSize)?.label} ({FONT_SIZE_OPTIONS.find((o) => o.value === arabicFontSize)?.detail})
              </span>
            </div>

            <div
              role="radiogroup"
              aria-labelledby="font-size-label"
              className="grid grid-cols-3 gap-2"
              onKeyDown={(e) => {
                const idx = FONT_SIZE_OPTIONS.findIndex((o) => o.value === arabicFontSize)
                if (e.key === "ArrowRight" || e.key === "ArrowDown") {
                  e.preventDefault()
                  setArabicFontSize(FONT_SIZE_OPTIONS[(idx + 1) % FONT_SIZE_OPTIONS.length].value)
                } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
                  e.preventDefault()
                  setArabicFontSize(FONT_SIZE_OPTIONS[(idx - 1 + FONT_SIZE_OPTIONS.length) % FONT_SIZE_OPTIONS.length].value)
                }
              }}
            >
              {FONT_SIZE_OPTIONS.map(({ value, label, detail }) => {
                const isSelected = arabicFontSize === value
                return (
                  <button
                    key={value}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    tabIndex={isSelected ? 0 : -1}
                    onClick={() => setArabicFontSize(value)}
                    className={[
                      "flex flex-col items-center justify-center rounded-xl border p-2.5 text-center transition-all outline-none",
                      "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
                      isSelected
                        ? "border-primary bg-primary/10 text-primary font-semibold shadow-xs"
                        : "border-border bg-card text-muted-foreground hover:border-border/80 hover:bg-accent hover:text-accent-foreground",
                    ].join(" ")}
                  >
                    <span className="text-sm">{label}</span>
                    <span className="text-[11px] font-normal opacity-90">{detail}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Section 2: Visibility toggles */}
          <div className="space-y-4 border-t border-border/60 pt-4">
            <h4 className="text-sm font-medium text-foreground">Tampilan Teks</h4>

            {/* Toggle Latin Transliteration */}
            <div className="flex items-center justify-between gap-4 rounded-xl border border-border/50 bg-card p-3.5">
              <div className="space-y-0.5">
                <label htmlFor="toggle-latin" className="cursor-pointer text-sm font-medium text-foreground">
                  Transliterasi Latin
                </label>
                <p className="text-xs text-muted-foreground">Lafal pengucapan dalam abjad latin</p>
              </div>
              <Switch
                id="toggle-latin"
                checked={showLatin}
                onCheckedChange={setShowLatin}
                aria-label="Tampilkan transliterasi latin"
              />
            </div>

            {/* Toggle Indonesian Translation */}
            <div className="flex items-center justify-between gap-4 rounded-xl border border-border/50 bg-card p-3.5">
              <div className="space-y-0.5">
                <label htmlFor="toggle-translation" className="cursor-pointer text-sm font-medium text-foreground">
                  Terjemahan Indonesia
                </label>
                <p className="text-xs text-muted-foreground">Terjemahan arti ayat bahasa Indonesia</p>
              </div>
              <Switch
                id="toggle-translation"
                checked={showTranslation}
                onCheckedChange={setShowTranslation}
                aria-label="Tampilkan terjemahan bahasa Indonesia"
              />
            </div>
          </div>

          {/* Section 3: Live Preview Box */}
          <div className="space-y-2.5 border-t border-border/60 pt-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Pratinjau Tampilan
            </span>
            <div className="rounded-xl border border-border/80 bg-muted/30 p-4 transition-all">
              <p
                dir="rtl"
                lang="ar"
                className={`text-right font-serif text-foreground transition-all duration-150 ${PREVIEW_ARABIC_CLASSES[arabicFontSize]}`}
              >
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </p>
              {showLatin && (
                <p className="mt-2 text-xs italic text-muted-foreground">Bismillāhir-raḥmānir-raḥīm</p>
              )}
              {showTranslation && (
                <p className="mt-1.5 text-xs text-foreground/80 leading-relaxed">
                  Dengan nama Allah Yang Maha Pengasih, Maha Penyayang.
                </p>
              )}
              {!showLatin && !showTranslation && (
                <p className="mt-2 text-[11px] text-muted-foreground text-center italic">
                  Mode mushaf (hanya teks Arab)
                </p>
              )}
            </div>
          </div>

          {/* Section 4: Reset Button */}
          <div className="border-t border-border/60 pt-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleResetDefaults}
              className="w-full gap-2 text-xs text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Kembalikan ke Default</span>
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
