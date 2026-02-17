'use client'

import { ProfileCard } from '@/components/profile/profile-card'
import { ReputationBadge } from '@/components/shared/reputation-badge'
import { ReviewList } from '@/components/reviews/review-list'
import type { CollabReviewWithProfile, Profile } from '@/types/database'
import Link from 'next/link'
import { useLanguage } from '@/lib/i18n'

interface UserProfileContentProps {
  profile: Profile
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  posts: any[] | null
  reviews: CollabReviewWithProfile[]
  averageRating: number | null
  completedCount: number
}

export function UserProfileContent({
  profile,
  posts,
  reviews,
  averageRating,
  completedCount,
}: UserProfileContentProps) {
  const { t } = useLanguage()
  const firstName = profile.full_name?.split(' ')[0]

  return (
    <div className="space-y-4 py-4">
      <ProfileCard profile={profile} />

      {/* Reputation */}
      {completedCount > 0 && (
        <div className="space-y-3">
          <ReputationBadge
            averageRating={averageRating}
            completedCount={completedCount}
          />
          <div>
            <h2 className="mb-2 text-lg font-semibold">{t('profile.reviews')}</h2>
            <ReviewList reviews={reviews} />
          </div>
        </div>
      )}

      <div className="mt-6">
        <h2 className="mb-3 text-lg font-semibold">
          {firstName}{t('profile.openCollabs')}
        </h2>
        {posts && posts.length > 0 ? (
          <div className="space-y-3">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/post/${post.id}`}
                className="block rounded-lg border p-3 transition-colors hover:bg-muted/50"
              >
                <h3 className="font-medium">{post.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                  {post.description}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-center text-sm text-muted-foreground">
            {t('profile.noOpenCollabs')}
          </p>
        )}
      </div>
    </div>
  )
}
