import { Skeleton } from "@/components/ui/skeleton"

interface LoadingSkeletonProps {
  /** Number of skeleton cards to show. Defaults to 12. */
  count?: number
}

export function LoadingSkeleton({ count = 12 }: LoadingSkeletonProps) {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 rounded-2xl p-6 ring-1 ring-foreground/10"
        >
          <Skeleton className="size-10 rounded-lg" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-3 w-40" />
          </div>
          <Skeleton className="h-6 w-14" />
        </div>
      ))}
    </div>
  )
}
