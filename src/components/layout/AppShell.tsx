import { Outlet } from "react-router-dom"
import { WifiOff } from "lucide-react"
import { Navbar } from "./Navbar"
import { ErrorBoundary } from "@/components/common/ErrorBoundary"
import { useOnlineStatus } from "@/hooks/useOnlineStatus"

export function AppShell() {
  const isOnline = useOnlineStatus()

  return (
    <div className="flex min-h-svh flex-col bg-background text-foreground">
      {/* Skip to main content link for keyboard accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-ring"
      >
        Lewati ke konten utama
      </a>

      <Navbar />

      {/* Offline banner when user is disconnected */}
      {!isOnline && (
        <div
          role="status"
          aria-live="polite"
          className="flex items-center justify-center gap-1.5 border-b border-border bg-muted/80 px-4 py-1.5 text-center text-xs text-muted-foreground"
        >
          <WifiOff className="size-3.5" aria-hidden="true" />
          <span>Mode Offline — Menampilkan data dari memori cache.</span>
        </div>
      )}

      <main
        id="main-content"
        tabIndex={-1}
        className="mx-auto w-full max-w-4xl flex-1 px-4 py-6 outline-none"
      >
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>
    </div>
  )
}
