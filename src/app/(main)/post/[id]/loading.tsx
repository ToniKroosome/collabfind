import { Loader2 } from 'lucide-react'

export default function PostLoading() {
  return (
    <div className="space-y-4 py-4">
      {/* Author skeleton */}
      <div className="flex items-center gap-3 animate-pulse">
        <div className="h-10 w-10 rounded-full bg-muted" />
        <div className="space-y-1.5">
          <div className="h-4 w-28 rounded bg-muted" />
          <div className="h-3 w-16 rounded bg-muted" />
        </div>
      </div>
      {/* Content skeleton */}
      <div className="space-y-3 animate-pulse">
        <div className="h-6 w-3/4 rounded bg-muted" />
        <div className="h-4 w-full rounded bg-muted" />
        <div className="h-4 w-5/6 rounded bg-muted" />
        <div className="h-4 w-2/3 rounded bg-muted" />
      </div>
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
      </div>
    </div>
  )
}
