export default function ProfileLoading() {
  return (
    <div className="space-y-4 py-4">
      {/* Profile card skeleton */}
      <div className="rounded-lg border p-4 animate-pulse">
        <div className="flex items-start gap-3">
          <div className="h-16 w-16 rounded-full bg-muted" />
          <div className="flex-1 space-y-2">
            <div className="h-5 w-1/3 rounded bg-muted" />
            <div className="h-3 w-1/4 rounded bg-muted" />
            <div className="h-3 w-2/3 rounded bg-muted" />
          </div>
        </div>
        <div className="mt-3 flex gap-2">
          <div className="h-6 w-16 rounded-full bg-muted" />
          <div className="h-6 w-20 rounded-full bg-muted" />
        </div>
      </div>
      {/* Action buttons skeleton */}
      <div className="flex gap-2">
        <div className="h-10 flex-1 rounded-lg bg-muted animate-pulse" />
        <div className="h-10 flex-1 rounded-lg bg-muted animate-pulse" />
      </div>
    </div>
  )
}
