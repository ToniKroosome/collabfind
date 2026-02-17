'use client'

import { ProfileCard } from '@/components/profile/profile-card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useLanguage } from '@/lib/i18n'
import type { Profile } from '@/types/database'

interface ProfilePageContentProps {
  profile: Profile
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  posts: any[] | null
  signOutAction: () => void
}

export function ProfilePageContent({ profile, posts, signOutAction }: ProfilePageContentProps) {
  const { t } = useLanguage()

  return (
    <div className="space-y-4 py-4">
      <ProfileCard profile={profile} />
      <div className="flex gap-2">
        <Link href="/profile?edit=true" className="flex-1">
          <Button variant="outline" className="w-full">
            {t('profile.editProfile')}
          </Button>
        </Link>
        <form action={signOutAction}>
          <Button variant="ghost" type="submit" className="text-red-500">
            {t('profile.signOut')}
          </Button>
        </form>
      </div>

      {/* User's own collab posts */}
      <div className="mt-6">
        <h2 className="mb-3 text-lg font-semibold">{t('profile.yourCollabPosts')}</h2>
        {!posts || posts.length === 0 ? (
          <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
            <p>{t('profile.noPostsYet')}</p>
            <Link href="/post/new">
              <Button variant="link" className="mt-2 text-indigo-600">
                {t('profile.createFirstPost')}
              </Button>
            </Link>
          </div>
        ) : (
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
                    {post.is_open ? t('common.open') : t('common.closed')}
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
                  {post.description}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
