import * as React from "react"
import { AlertTriangle, RotateCcw, Home } from "lucide-react"
import { Button } from "@/components/ui/button"

export interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?:
    | React.ReactNode
    | ((props: { error: Error; reset: () => void }) => React.ReactNode)
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error("ErrorBoundary caught an unhandled error:", error, errorInfo)
  }

  reset = (): void => {
    this.setState({ hasError: false, error: null })
  }

  render(): React.ReactNode {
    const { hasError, error } = this.state
    const { children, fallback } = this.props

    if (hasError && error) {
      if (typeof fallback === "function") {
        return fallback({ error, reset: this.reset })
      }
      if (fallback) {
        return fallback
      }

      return (
        <div
          role="alert"
          aria-live="assertive"
          className="mx-auto flex min-h-[300px] w-full max-w-lg flex-col items-center justify-center p-6 text-center"
        >
          <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
            <AlertTriangle className="size-6" aria-hidden="true" />
          </div>

          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            Terjadi Kesalahan
          </h2>

          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            Aplikasi mengalami kendala yang tidak terduga. Silakan coba muat
            ulang atau kembali ke beranda.
          </p>

          {error.message && (
            <p className="mt-3 max-w-md rounded-md bg-muted/60 px-3 py-1.5 font-mono text-xs text-muted-foreground break-words">
              {error.message}
            </p>
          )}

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Button
              variant="default"
              size="sm"
              onClick={this.reset}
              className="gap-2"
            >
              <RotateCcw className="size-4" aria-hidden="true" />
              <span>Coba Lagi</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                window.location.href = "/"
              }}
              className="gap-2"
            >
              <Home className="size-4" aria-hidden="true" />
              <span>Ke Beranda</span>
            </Button>
          </div>
        </div>
      )
    }

    return children
  }
}
