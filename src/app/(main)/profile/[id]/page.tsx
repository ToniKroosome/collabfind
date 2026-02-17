import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { UserProfileContent } from '@/components/profile/user-profile-content'
import type { CollabReviewWithProfile } from '@/types/database'

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
    <UserProfileContent
      profile={profile}
      posts={posts}
      reviews={reviewsList}
      averageRating={averageRating}
      completedCount={completedCount}
    />
  )
}
