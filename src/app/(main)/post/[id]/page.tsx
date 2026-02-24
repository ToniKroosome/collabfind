import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { PostDetailContent } from '@/components/post/post-detail-content'
import type { InterestWithProfile } from '@/types/database'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()
  const { data: post } = await supabase
    .from('collab_posts')
    .select('title, description')
    .eq('id', id)
    .single()

  if (!post) return { title: 'Post not found' }

  const description = post.description?.slice(0, 160) || 'Check out this collab opportunity!'

  return {
    title: `${post.title} — IntrovertxCollab`,
    description,
    openGraph: {
      title: post.title,
      description,
      type: 'article',
    },
    twitter: {
      card: 'summary',
      title: post.title,
      description,
    },
  }
}

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: post } = await supabase
    .from('collab_posts')
    .select('*, profiles:user_id(*)')
    .eq('id', id)
    .single()

  if (!post) notFound()

  const isOwner = user ? user.id === post.user_id : false

  // Check if current user already expressed interest
  let hasExpressedInterest = false
  if (user && !isOwner) {
    const { data: existingInterest } = await supabase
      .from('interests')
      .select('id')
      .eq('post_id', id)
      .eq('user_id', user.id)
      .maybeSingle()
    hasExpressedInterest = !!existingInterest
  }

  // If owner, fetch interests
  let interests: InterestWithProfile[] = []
  if (isOwner && user) {
    const { data } = await supabase
      .from('interests')
      .select('*, profiles:user_id(*)')
      .eq('post_id', id)
      .order('created_at', { ascending: false })
    interests = (data as InterestWithProfile[]) || []
  }

  // Fetch like count and whether current user liked
  const { count: likeCount } = await supabase
    .from('post_likes')
    .select('*', { count: 'exact', head: true })
    .eq('post_id', id)

  let isLiked = false
  if (user) {
    const { data: userLike } = await supabase
      .from('post_likes')
      .select('id')
      .eq('post_id', id)
      .eq('user_id', user.id)
      .maybeSingle()
    isLiked = !!userLike
  }

  // Check if any match for this post has an accepted contract
  let hasAcceptedContract = false
  if (isOwner) {
    const { data: matches } = await supabase
      .from('matches')
      .select('id')
      .eq('post_id', id)
    const matchIds = matches?.map((m) => m.id) || []
    if (matchIds.length > 0) {
      const { data: contracts } = await supabase
        .from('collab_contracts')
        .select('id')
        .in('match_id', matchIds)
        .eq('status', 'accepted')
        .limit(1)
      hasAcceptedContract = (contracts?.length ?? 0) > 0
    }
  }

  return (
    <PostDetailContent
      post={post}
      isOwner={isOwner}
      hasExpressedInterest={hasExpressedInterest}
      interests={interests}
      userId={user?.id || null}
      hasAcceptedContract={hasAcceptedContract}
      likeCount={likeCount ?? 0}
      isLiked={isLiked}
    />
  )
}
