import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { PostDetailContent } from '@/components/post/post-detail-content'
import type { InterestWithProfile } from '@/types/database'

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

  if (!user) redirect('/login')

  const { data: post } = await supabase
    .from('collab_posts')
    .select('*, profiles:user_id(*)')
    .eq('id', id)
    .single()

  if (!post) notFound()

  const isOwner = user.id === post.user_id

  // Check if current user already expressed interest
  let hasExpressedInterest = false
  if (!isOwner) {
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
  if (isOwner) {
    const { data } = await supabase
      .from('interests')
      .select('*, profiles:user_id(*)')
      .eq('post_id', id)
      .order('created_at', { ascending: false })
    interests = (data as InterestWithProfile[]) || []
  }

  return (
    <PostDetailContent
      post={post}
      isOwner={isOwner}
      hasExpressedInterest={hasExpressedInterest}
      interests={interests}
      userId={user.id}
    />
  )
}
