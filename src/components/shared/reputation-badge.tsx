'use client'

import { StarRating } from '@/components/shared/star-rating'
import { CheckCircle } from 'lucide-react'
import { useLanguage } from '@/lib/i18n'

interface ReputationBadgeProps {
  averageRating: number | null
  completedCount: number
}

export function ReputationBadge({ averageRating, completedCount }: ReputationBadgeProps) {
  const { t } = useLanguage()

  if (completedCount === 0) return null

  return (
    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
      {averageRating !== null && (
        <>
          <StarRating rating={averageRating} size="sm" />
          <span className="font-medium">{averageRating.toFixed(1)}</span>
        </>
      )}
      <span className="flex items-center gap-0.5">
        <CheckCircle className="h-3 w-3 text-green-500" />
        {completedCount} {completedCount !== 1 ? t('reputation.collabs') : t('reputation.collab')}
      </span>
    </div>
  )
}
