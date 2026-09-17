import { Search } from "lucide-react"

interface EmptyStateProps {
  message?: string
}

export function EmptyState({
  message = "Tidak ada data yang ditemukan.",
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <Search className="mb-4 size-10 text-muted-foreground/40" />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  )
}
