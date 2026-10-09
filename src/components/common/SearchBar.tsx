import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  onClear?: () => void
  autoFocus?: boolean
}

export function SearchBar({ value, onChange, onClear, autoFocus }: SearchBarProps) {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <Search className="size-4 text-muted-foreground" aria-hidden="true" />
      </div>
      <Input
        type="search"
        role="searchbox"
        aria-label="Cari surah atau ayat"
        placeholder="Cari surah (ex: Baqarah, 2, atau 2:255)..."
        className="pl-10 pr-10"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoFocus={autoFocus}
      />
      {value && onClear && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute inset-y-0 right-0 h-full px-3 hover:bg-transparent"
          onClick={onClear}
          aria-label="Hapus pencarian"
        >
          <X className="size-4 text-muted-foreground" aria-hidden="true" />
        </Button>
      )}
    </div>
  )
}
