import { Skeleton } from "@/components/ui/skeleton"

export function MushafPageSkeleton() {
  return (
    <div
      data-testid="mushaf-page-skeleton"
      className="relative rounded-xl border border-border bg-card p-3 shadow-xs transition-colors sm:px-5 sm:py-3.5"
    >
      {/* Mushaf Page Header & Navigation Skeleton */}
      <div className="mb-2 space-y-1.5 select-none">
        <div className="flex items-center justify-between border-b border-border/60 pb-1.5">
          <div className="w-24">
            <Skeleton className="h-7 w-16 sm:w-20 rounded-md" />
          </div>
          <div className="flex items-baseline justify-center gap-1.5 text-center">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-4 w-12" />
          </div>
          <div className="flex w-24 justify-end">
            <Skeleton className="h-7 w-16 sm:w-20 rounded-md" />
          </div>
        </div>

        {/* Decorative Surah Banner Skeleton */}
        <div className="relative flex items-center justify-between rounded-lg border border-primary/20 bg-primary/5 px-3 py-1 shadow-2xs dark:border-primary/40 dark:bg-primary/10">
          <Skeleton className="h-3.5 w-14" />
          <div className="flex items-center justify-center rounded-full border border-primary/30 bg-background/90 px-4 py-0.5 shadow-xs">
            <Skeleton className="h-5 w-24" />
          </div>
          <Skeleton className="h-3.5 w-14" />
        </div>
      </div>

      {/* Surah Content Skeleton */}
      <div className="space-y-2.5">
        {/* Bismillah Skeleton */}
        <div className="py-0.5 text-center">
          <Skeleton className="mx-auto h-6 w-48" />
        </div>

        {/* Continuous Flowing Arabic Text Skeleton */}
        <div className="space-y-3.5 py-2" dir="rtl">
          <Skeleton className="h-7 w-full" />
          <Skeleton className="h-7 w-full" />
          <Skeleton className="h-7 w-11/12" />
          <Skeleton className="h-7 w-full" />
          <Skeleton className="h-7 w-full" />
          <Skeleton className="h-7 w-4/5" />
          <Skeleton className="h-7 w-full" />
          <Skeleton className="h-7 w-full" />
          <Skeleton className="h-7 w-3/5" />
        </div>
      </div>
    </div>
  )
}
