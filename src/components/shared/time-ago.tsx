'use client'

import { useMemo } from 'react'
import { useLanguage } from '@/lib/i18n'
import type { Translations } from '@/lib/i18n'

type TranslateFn = (key: keyof Translations) => string

function formatTimeAgo(dateString: string, t: TranslateFn): string {
  const now = new Date()
  const date = new Date(dateString)
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (seconds < 60) return t('time.justNow')
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return t('time.minutesAgo').replace('{n}', String(minutes))
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return t('time.hoursAgo').replace('{n}', String(hours))
  const days = Math.floor(hours / 24)
  if (days < 7) return t('time.daysAgo').replace('{n}', String(days))
  const weeks = Math.floor(days / 7)
  if (weeks < 4) return t('time.weeksAgo').replace('{n}', String(weeks))
  return date.toLocaleDateString()
}

export function TimeAgo({ date }: { date: string }) {
  const { t } = useLanguage()
  const text = useMemo(() => formatTimeAgo(date, t), [date, t])

  return <span suppressHydrationWarning>{text}</span>
}

// Keep for backward compat in client-only contexts
export const timeAgo = formatTimeAgo
