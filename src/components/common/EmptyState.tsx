import { Search } from "lucide-react"

interface EmptyStateProps {
  message?: string
}

export function EmptyState({
  message = "Tidak ada data yang ditemukan.",
}: EmptyStateProps) {
  return (
    <div
      role="status"
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      <Search className="mb-4 size-10 text-muted-foreground/40" aria-hidden="true" />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  )
}
