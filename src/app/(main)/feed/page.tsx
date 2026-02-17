import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { CollabCard } from '@/components/feed/collab-card'
import { FeedFilters } from '@/components/feed/feed-filters'
import { FeedEmptyState } from '@/components/feed/feed-empty-state'
import { SHOW_MOCK_DATA, MOCK_POSTS, MOCK_REPUTATION } from '@/lib/mock-data'
import type { CollabPostWithProfile } from '@/types/database'

export default async function FeedPage({
  searchParams,
}: {
  searchParams: Promise<{ niche?: string; type?: string }>
}) {
  const [supabase, params] = await Promise.all([
    createClient(),
    searchParams,
  ])

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Check if profile is complete (only for logged-in users)
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_profile_complete')
      .eq('id', user.id)
      .single()

    if (profile && !profile.is_profile_complete) {
      redirect('/profile')
    }
  }

  const nicheFilter = params.niche
  const typeFilter = params.type

  let query = supabase
    .from('collab_posts')
    .select('*, profiles:user_id(*)')
    .eq('is_open', true)
    .order('created_at', { ascending: false })
    .limit(50)

  if (nicheFilter) {
    query = query.contains('niche_tags', [nicheFilter])
  }
  if (typeFilter) {
    query = query.eq('collab_type', typeFilter)
  }

  const { data: dbPosts } = await query

  // Merge real posts with mock data
  let posts = (dbPosts as CollabPostWithProfile[]) || []
  if (SHOW_MOCK_DATA) {
    let mockPosts = MOCK_POSTS as unknown as CollabPostWithProfile[]
    if (nicheFilter) {
      mockPosts = mockPosts.filter((p) => p.niche_tags.includes(nicheFilter))
    }
    if (typeFilter) {
      mockPosts = mockPosts.filter((p) => p.collab_type === typeFilter)
    }
    posts = [...posts, ...mockPosts].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
  }

  // Fetch reputation data for post authors
  const authorIds = [...new Set(posts.map((p) => p.user_id))]
  const reputationMap = new Map<string, { avgRating: number; count: number }>()

  if (authorIds.length > 0) {
    const { data: reputationData } = await supabase
      .from('collab_reviews')
      .select('reviewee_id, rating')
      .in('reviewee_id', authorIds)

    if (reputationData) {
      const grouped: Record<string, number[]> = {}
      for (const r of reputationData) {
        if (!grouped[r.reviewee_id]) grouped[r.reviewee_id] = []
        grouped[r.reviewee_id].push(r.rating)
      }
      for (const [userId, ratings] of Object.entries(grouped)) {
        reputationMap.set(userId, {
          avgRating: ratings.reduce((a, b) => a + b, 0) / ratings.length,
          count: ratings.length,
        })
      }
    }
  }

  // Merge mock reputation data
  if (SHOW_MOCK_DATA && MOCK_REPUTATION) {
    for (const [userId, rep] of Object.entries(MOCK_REPUTATION)) {
      if (!reputationMap.has(userId)) {
        reputationMap.set(userId, rep)
      }
    }
  }

  return (
    <div className="space-y-4 py-4">
      <FeedFilters />

      {posts.length > 0 ? (
        <div className="space-y-3">
          {posts.map((post) => (
            <CollabCard
              key={post.id}
              post={post}
              reputation={reputationMap.get(post.user_id)}
            />
          ))}
        </div>
      ) : (
        <FeedEmptyState />
      )}
    </div>
  )
}
