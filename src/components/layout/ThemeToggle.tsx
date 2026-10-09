import { Monitor, Moon, Sun } from "lucide-react"
import { useTheme, type Theme } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import * as React from "react"

const THEMES: { value: Theme; label: string; icon: React.ReactNode }[] = [
  { value: "light", label: "Terang", icon: <Sun className="h-4 w-4" /> },
  { value: "dark", label: "Gelap", icon: <Moon className="h-4 w-4" /> },
  { value: "system", label: "Sistem", icon: <Monitor className="h-4 w-4" /> },
]

const CYCLE_ORDER: Theme[] = ["light", "dark", "system"]

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [open, setOpen] = React.useState(false)
  const menuRef = React.useRef<HTMLDivElement>(null)

  // Close menu on outside click
  React.useEffect(() => {
    if (!open) return
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [open])

  // Close menu on Escape
  React.useEffect(() => {
    if (!open) return
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [open])

  const currentEntry = THEMES.find((t) => t.value === theme) ?? THEMES[2]

  function handleCycle() {
    const idx = CYCLE_ORDER.indexOf(theme)
    const next = CYCLE_ORDER[(idx + 1) % CYCLE_ORDER.length]
    setTheme(next)
  }

  return (
    <div className="relative" ref={menuRef}>
      {/* Long press / right-click or ArrowDown → dropdown; single click → cycle */}
      <Button
        id="theme-toggle"
        variant="ghost"
        size="icon"
        aria-label={`Tema saat ini: ${currentEntry.label}. Klik untuk mengganti atau tekan panah bawah untuk menu.`}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={handleCycle}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault()
            setOpen(true)
          }
        }}
        onContextMenu={(e) => {
          e.preventDefault()
          setOpen((v) => !v)
        }}
        className="relative h-9 w-9"
      >
        <span
          className="absolute inset-0 flex items-center justify-center transition-all duration-200"
          aria-hidden="true"
        >
          {currentEntry.icon}
        </span>
        <span className="sr-only">{currentEntry.label}</span>
      </Button>

      {/* Dropdown menu for explicit selection */}
      {open && (
        <div
          role="menu"
          aria-label="Pilih tema"
          className="absolute right-0 top-full z-50 mt-1 min-w-[9rem] overflow-hidden rounded-lg border border-border bg-popover p-1 shadow-lg animate-in fade-in-0 zoom-in-95"
        >
          {THEMES.map(({ value, label, icon }) => (
            <button
              key={value}
              type="button"
              role="menuitem"
              onClick={() => {
                setTheme(value)
                setOpen(false)
              }}
              className={[
                "flex w-full items-center gap-2.5 rounded-md px-3 py-1.5 text-sm transition-colors outline-none",
                "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus-visible:ring-1 focus-visible:ring-ring",
                theme === value
                  ? "text-primary font-medium"
                  : "text-muted-foreground",
              ].join(" ")}
            >
              {icon}
              {label}
              {theme === value && (
                <span className="ml-auto text-primary" aria-hidden="true">
                  ✓
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
