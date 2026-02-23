import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { CreatePostForm } from '@/components/post/create-post-form'
import type { CollabPost } from '@/types/database'

export default async function EditPostPage({
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
    .select('*')
    .eq('id', id)
    .single()

  if (!post) notFound()

  // Only the owner can edit
  if (post.user_id !== user.id) redirect(`/post/${id}`)

  // Check if any match has an accepted contract — if so, editing is locked
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
    if ((contracts?.length ?? 0) > 0) {
      redirect(`/post/${id}`)
    }
  }

  return (
    <div className="py-4">
      <CreatePostForm userId={user.id} editPost={post as CollabPost} />
    </div>
  )
}
