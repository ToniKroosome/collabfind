import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ProfileCard } from '@/components/profile/profile-card'
import Link from 'next/link'

export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single()

  if (!profile) notFound()

  const { data: posts } = await supabase
    .from('collab_posts')
    .select('*')
    .eq('user_id', id)
    .eq('is_open', true)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-4 py-4">
      <ProfileCard profile={profile} />

      <div className="mt-6">
        <h2 className="mb-3 text-lg font-semibold">
          {profile.full_name?.split(' ')[0] || 'Their'}&apos;s Open Collabs
        </h2>
        {posts && posts.length > 0 ? (
          <div className="space-y-3">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/post/${post.id}`}
                className="block rounded-lg border p-3 transition-colors hover:bg-muted/50"
              >
                <h3 className="font-medium">{post.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                  {post.description}
                </p>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-center text-sm text-muted-foreground">
            No open collab posts yet.
          </p>
        )}
      </div>
    </div>
  )
}
