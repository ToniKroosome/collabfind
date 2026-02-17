function ConversationSkeleton() {
  return (
    <div className="flex items-center gap-3 rounded-lg border p-3 animate-pulse">
      <div className="h-12 w-12 rounded-full bg-muted" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-1/3 rounded bg-muted" />
        <div className="h-3 w-2/3 rounded bg-muted" />
      </div>
      <div className="h-3 w-10 rounded bg-muted" />
    </div>
  )
}

export default function MessagesLoading() {
  return (
    <div className="space-y-4 py-4">
      <div className="h-8 w-32 rounded bg-muted animate-pulse" />
      <div className="space-y-2">
        <ConversationSkeleton />
        <ConversationSkeleton />
        <ConversationSkeleton />
      </div>
    </div>
  )
}
