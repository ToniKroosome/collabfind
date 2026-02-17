import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { CollabCard } from '@/components/feed/collab-card'
import { FeedFilters } from '@/components/feed/feed-filters'
import { SHOW_MOCK_DATA, MOCK_POSTS } from '@/lib/mock-data'
import type { CollabPostWithProfile } from '@/types/database'

export default async function FeedPage({
  searchParams,
}: {
  searchParams: Promise<{ niche?: string; type?: string }>
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Check if profile is complete
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (profile && !profile.is_profile_complete) {
    redirect('/profile')
  }

  const params = await searchParams
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

  return (
    <div className="space-y-4 py-4">
      <FeedFilters />

      {posts.length > 0 ? (
        <div className="space-y-3">
          {posts.map((post) => (
            <CollabCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="py-12 text-center">
          <p className="text-lg font-medium">No collab posts yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Be the first to post a collaboration opportunity!
          </p>
        </div>
      )}
    </div>
  )
}
