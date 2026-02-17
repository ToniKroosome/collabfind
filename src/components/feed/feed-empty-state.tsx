'use client'

import { useLanguage } from '@/lib/i18n'

export function FeedEmptyState() {
  const { t } = useLanguage()

  return (
    <div className="py-12 text-center">
      <p className="text-lg font-medium">{t('feed.noPostsYet')}</p>
      <p className="mt-1 text-sm text-muted-foreground">
        {t('feed.beFirst')}
      </p>
    </div>
  )
}
