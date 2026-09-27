import { Link } from "react-router-dom"
import { BookOpen } from "lucide-react"
import { ThemeToggle } from "./ThemeToggle"
import { ReadingSettingsSheet } from "./ReadingSettingsSheet"

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-sm">
      <nav className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
        <Link
          to="/"
          className="flex items-center gap-2 text-lg font-semibold text-foreground"
          aria-label="Beranda"
        >
          <BookOpen className="h-5 w-5" />
          <span>Qur'an</span>
        </Link>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <Link
            to="/bookmarks"
            className="px-2 py-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Bookmark
          </Link>
          <ReadingSettingsSheet />
          <ThemeToggle />
        </div>
      </nav>
    </header>
  )
}

