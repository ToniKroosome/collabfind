import { Loader2 } from 'lucide-react'

export default function MatchesLoading() {
  return (
    <div className="space-y-4 py-4">
      <div className="h-8 w-40 rounded bg-muted animate-pulse" />
      <div className="flex gap-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-9 w-20 rounded-lg bg-muted animate-pulse" />
        ))}
      </div>
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    </div>
  )
}
