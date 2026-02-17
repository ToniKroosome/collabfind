import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { SHOW_MOCK_DATA, MOCK_MATCHES } from '@/lib/mock-data'
import { MatchTabs } from '@/components/matches/match-tabs'

export default async function MatchesPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: dbMatches } = await supabase
    .from('matches')
    .select(
      `*,
      collab_posts:post_id (id, title, collab_type),
      partner_a:user_a (id, full_name, avatar_url, username),
      partner_b:user_b (id, full_name, avatar_url, username)`
    )
    .or(`user_a.eq.${user.id},user_b.eq.${user.id}`)
    .order('created_at', { ascending: false })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let allMatches = ((dbMatches || []) as any[])
  if (SHOW_MOCK_DATA) {
    allMatches = [...allMatches, ...MOCK_MATCHES].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
  }

  // Check which matches the user has already reviewed
  const { data: userReviews } = await supabase
    .from('collab_reviews')
    .select('match_id')
    .eq('reviewer_id', user.id)

  const reviewedMatchIds = new Set((userReviews || []).map((r) => r.match_id))

  return (
    <div className="space-y-4 py-4">
      <h1 className="text-2xl font-bold">Your Matches</h1>
      <MatchTabs
        matches={allMatches}
        currentUserId={user.id}
        reviewedMatchIds={Array.from(reviewedMatchIds)}
      />
    </div>
  )
}
