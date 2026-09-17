import { Link } from "react-router-dom"

export function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <h1 className="text-6xl font-bold text-muted-foreground">404</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        Halaman tidak ditemukan.
      </p>
      <Link
        to="/"
        className="mt-6 text-sm font-medium text-primary underline underline-offset-4 transition-colors hover:text-primary/80"
      >
        Kembali ke Beranda
      </Link>
    </div>
  )
}
