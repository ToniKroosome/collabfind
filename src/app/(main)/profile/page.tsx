import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ProfileForm } from '@/components/profile/profile-form'
import { ProfilePageContent } from '@/components/profile/profile-page-content'

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) redirect('/login')

  const params = await searchParams
  const isEditing = params.edit === 'true' || !profile.is_profile_complete

  if (isEditing) {
    return (
      <div className="py-4">
        <ProfileForm
          profile={profile}
          isOnboarding={!profile.is_profile_complete}
        />
      </div>
    )
  }

  // Fetch user's posts
  const { data: posts } = await supabase
    .from('collab_posts')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const signOutAction = async () => {
    'use server'
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/login')
  }

  return (
    <ProfilePageContent
      profile={profile}
      posts={posts}
      signOutAction={signOutAction}
    />
  )
}
