import { createClient } from '@/lib/supabase/server'
import { AdminDashboard } from '@/components/admin/admin-dashboard'

export default async function AdminPage() {
  const supabase = await createClient()

  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  const sevenDaysAgoISO = sevenDaysAgo.toISOString()

  // Run all queries in parallel
  const [
    usersResult,
    postsResult,
    openPostsResult,
    matchesResult,
    activeMatchesResult,
    completedMatchesResult,
    messagesResult,
    reviewsResult,
    recentSignupsResult,
    signupsLast7Result,
    postsLast7Result,
  ] = await Promise.all([
    // Total users
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    // Total posts
    supabase.from('collab_posts').select('*', { count: 'exact', head: true }),
    // Open posts
    supabase
      .from('collab_posts')
      .select('*', { count: 'exact', head: true })
      .eq('is_open', true),
    // Total matches
    supabase.from('matches').select('*', { count: 'exact', head: true }),
    // Active matches
    supabase
      .from('matches')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active'),
    // Completed matches
    supabase
      .from('matches')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'completed'),
    // Total messages
    supabase.from('messages').select('*', { count: 'exact', head: true }),
    // Reviews with ratings
    supabase.from('collab_reviews').select('rating'),
    // Recent signups (last 10)
    supabase
      .from('profiles')
      .select('id, full_name, username, created_at')
      .order('created_at', { ascending: false })
      .limit(10),
    // Signups last 7 days
    supabase
      .from('profiles')
      .select('created_at')
      .gte('created_at', sevenDaysAgoISO)
      .order('created_at', { ascending: true }),
    // Posts last 7 days
    supabase
      .from('collab_posts')
      .select('created_at')
      .gte('created_at', sevenDaysAgoISO)
      .order('created_at', { ascending: true }),
  ])

  const totalUsers = usersResult.count ?? 0
  const totalPosts = postsResult.count ?? 0
  const openPosts = openPostsResult.count ?? 0
  const closedPosts = totalPosts - openPosts
  const totalMatches = matchesResult.count ?? 0
  const activeMatches = activeMatchesResult.count ?? 0
  const completedMatches = completedMatchesResult.count ?? 0
  const totalMessages = messagesResult.count ?? 0

  const reviews = reviewsResult.data ?? []
  const totalReviews = reviews.length
  const avgRating =
    totalReviews > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
      : 0

  // Group signups by day
  function groupByDay(rows: { created_at: string }[] | null): { date: string; count: number }[] {
    const map = new Map<string, number>()
    // Initialize all 7 days
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      map.set(d.toISOString().split('T')[0], 0)
    }
    for (const row of rows ?? []) {
      const day = row.created_at.split('T')[0]
      map.set(day, (map.get(day) ?? 0) + 1)
    }
    return Array.from(map.entries()).map(([date, count]) => ({ date, count }))
  }

  const signupsLast7Days = groupByDay(signupsLast7Result.data)
  const postsLast7Days = groupByDay(postsLast7Result.data)

  const recentSignups = (recentSignupsResult.data ?? []).map((u) => ({
    id: u.id,
    full_name: u.full_name,
    username: u.username,
    created_at: u.created_at,
  }))

  return (
    <AdminDashboard
      totalUsers={totalUsers}
      totalPosts={totalPosts}
      openPosts={openPosts}
      closedPosts={closedPosts}
      totalMatches={totalMatches}
      activeMatches={activeMatches}
      completedMatches={completedMatches}
      totalMessages={totalMessages}
      totalReviews={totalReviews}
      avgRating={avgRating}
      signupsLast7Days={signupsLast7Days}
      postsLast7Days={postsLast7Days}
      recentSignups={recentSignups}
    />
  )
}
