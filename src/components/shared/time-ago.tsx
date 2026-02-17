'use client'

import { useEffect, useState } from 'react'

function formatTimeAgo(dateString: string): string {
  const now = new Date()
  const date = new Date(dateString)
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  const weeks = Math.floor(days / 7)
  if (weeks < 4) return `${weeks}w ago`
  return date.toLocaleDateString()
}

export function TimeAgo({ date }: { date: string }) {
  const [text, setText] = useState('')

  useEffect(() => {
    setText(formatTimeAgo(date))
  }, [date])

  return <span suppressHydrationWarning>{text}</span>
}

// Keep for backward compat in client-only contexts
export const timeAgo = formatTimeAgo
