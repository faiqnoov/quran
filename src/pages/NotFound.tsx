import { Link } from "react-router-dom"
import { usePageTitle } from "@/hooks/usePageTitle"

export function NotFoundPage() {
  usePageTitle("404 - Halaman Tidak Ditemukan")
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <h1 className="text-6xl font-bold text-muted-foreground">404</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        Halaman tidak ditemukan.
      </p>
      <Link
        to="/"
        className="mt-6 rounded-md text-sm font-medium text-primary underline underline-offset-4 transition-colors hover:text-primary/80 outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        Kembali ke Beranda
      </Link>
    </div>
  )
}
