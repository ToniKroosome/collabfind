import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { CreatePostForm } from '@/components/post/create-post-form'

export default async function NewPostPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  return <CreatePostForm userId={user.id} />
}
