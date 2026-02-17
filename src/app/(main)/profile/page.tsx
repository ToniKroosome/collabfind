import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ProfileForm } from '@/components/profile/profile-form'
import { ProfileCard } from '@/components/profile/profile-card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

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

  return (
    <div className="space-y-4 py-4">
      <ProfileCard profile={profile} />
      <div className="flex gap-2">
        <Link href="/profile?edit=true" className="flex-1">
          <Button variant="outline" className="w-full">
            Edit Profile
          </Button>
        </Link>
        <form
          action={async () => {
            'use server'
            const supabase = await createClient()
            await supabase.auth.signOut()
            redirect('/login')
          }}
        >
          <Button variant="ghost" type="submit" className="text-red-500">
            Sign Out
          </Button>
        </form>
      </div>

      {/* User's own collab posts */}
      <div className="mt-6">
        <h2 className="mb-3 text-lg font-semibold">Your Collab Posts</h2>
        <MyPosts userId={user.id} />
      </div>
    </div>
  )
}

async function MyPosts({ userId }: { userId: string }) {
  const supabase = await createClient()
  const { data: posts } = await supabase
    .from('collab_posts')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (!posts || posts.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
        <p>You haven&apos;t created any collab posts yet.</p>
        <Link href="/post/new">
          <Button variant="link" className="mt-2 text-indigo-600">
            Create your first post
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {posts.map((post) => (
        <Link
          key={post.id}
          href={`/post/${post.id}`}
          className="block rounded-lg border p-3 transition-colors hover:bg-muted/50"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-medium">{post.title}</h3>
            <span
              className={`text-xs ${post.is_open ? 'text-green-600' : 'text-gray-400'}`}
            >
              {post.is_open ? 'Open' : 'Closed'}
            </span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
            {post.description}
          </p>
        </Link>
      ))}
    </div>
  )
}
