import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ProfileCard } from '@/components/profile/profile-card'
import { ReputationBadge } from '@/components/shared/reputation-badge'
import { ReviewList } from '@/components/reviews/review-list'
import type { CollabReviewWithProfile } from '@/types/database'
import Link from 'next/link'

export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single()

  if (!profile) notFound()

  const { data: posts } = await supabase
    .from('collab_posts')
    .select('*')
    .eq('user_id', id)
    .eq('is_open', true)
    .order('created_at', { ascending: false })

  // Fetch reviews for this user
  const { data: reviews } = await supabase
    .from('collab_reviews')
    .select('*, profiles:reviewer_id!collab_reviews_reviewer_id_fkey(*)')
    .eq('reviewee_id', id)
    .order('created_at', { ascending: false })
    .limit(10)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const reviewsList = (reviews as any as CollabReviewWithProfile[]) || []

  // Calculate reputation stats
  const completedCount = reviewsList.length
  const averageRating =
    reviewsList.length > 0
      ? reviewsList.reduce((sum, r) => sum + r.rating, 0) / reviewsList.length
      : null

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
            <h2 className="mb-2 text-lg font-semibold">Reviews</h2>
            <ReviewList reviews={reviewsList} />
          </div>
        </div>
      )}

      <div className="mt-6">
        <h2 className="mb-3 text-lg font-semibold">
          {profile.full_name?.split(' ')[0] || 'Their'}&apos;s Open Collabs
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
            No open collab posts yet.
          </p>
        )}
      </div>
    </div>
  )
}
