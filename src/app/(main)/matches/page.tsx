import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { COLLAB_TYPES } from '@/lib/constants'
import { SHOW_MOCK_DATA, MOCK_MATCHES } from '@/lib/mock-data'
import { timeAgo } from '@/components/shared/time-ago'
import { MessageCircle } from 'lucide-react'
import Link from 'next/link'

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

  return (
    <div className="space-y-4 py-4">
      <h1 className="text-2xl font-bold">Your Matches</h1>

      {allMatches.length > 0 ? (
        <div className="space-y-3">
          {allMatches.map((match) => {
            const partner =
              match.user_a === user.id ? match.partner_b : match.partner_a
            const typeLabel =
              COLLAB_TYPES.find(
                (t) => t.value === match.collab_posts?.collab_type
              )?.label || match.collab_posts?.collab_type

            return (
              <Card key={match.id}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Link href={`/profile/${partner.id}`}>
                      <Avatar className="h-12 w-12">
                        <AvatarImage
                          src={partner.avatar_url || undefined}
                        />
                        <AvatarFallback>
                          {partner.full_name?.charAt(0) || '?'}
                        </AvatarFallback>
                      </Avatar>
                    </Link>
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/profile/${partner.id}`}
                        className="font-semibold hover:underline"
                      >
                        {partner.full_name}
                      </Link>
                      {match.collab_posts && (
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {match.collab_posts.title}
                        </p>
                      )}
                      <div className="mt-1 flex items-center gap-2">
                        {typeLabel && (
                          <Badge variant="secondary" className="text-xs">
                            {typeLabel}
                          </Badge>
                        )}
                        <span className="text-xs text-muted-foreground">
                          Matched {timeAgo(match.created_at)}
                        </span>
                      </div>
                    </div>
                    <Link href={`/messages/${match.id}`}>
                      <Button
                        size="sm"
                        className="bg-indigo-600 hover:bg-indigo-700"
                      >
                        <MessageCircle className="mr-1 h-4 w-4" />
                        Chat
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : (
        <div className="py-12 text-center">
          <p className="text-lg font-medium">No matches yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Express interest in collab posts to get matched with other creators!
          </p>
          <Link href="/feed">
            <Button variant="link" className="mt-2 text-indigo-600">
              Browse Collabs
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}
