function CardSkeleton() {
  return (
    <div className="rounded-lg border bg-card p-4 animate-pulse">
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 rounded-full bg-muted" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-1/3 rounded bg-muted" />
          <div className="h-3 w-1/4 rounded bg-muted" />
        </div>
      </div>
      <div className="mt-3 space-y-2">
        <div className="h-5 w-3/4 rounded bg-muted" />
        <div className="h-3 w-full rounded bg-muted" />
        <div className="h-3 w-5/6 rounded bg-muted" />
      </div>
      <div className="mt-3 flex gap-2">
        <div className="h-6 w-16 rounded-full bg-muted" />
        <div className="h-6 w-20 rounded-full bg-muted" />
      </div>
    </div>
  )
}

export default function FeedLoading() {
  return (
    <div className="space-y-4 py-4">
      {/* Filter skeleton */}
      <div className="flex gap-2 overflow-hidden">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-8 w-24 shrink-0 rounded-full bg-muted animate-pulse" />
        ))}
      </div>

      {/* Card skeletons */}
      <div className="space-y-3">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    </div>
  )
}
