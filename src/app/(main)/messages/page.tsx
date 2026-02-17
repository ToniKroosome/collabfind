import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import { SHOW_MOCK_DATA, MOCK_CONVERSATIONS } from '@/lib/mock-data'
import Link from 'next/link'
import type { Message } from '@/types/database'

export default async function MessagesPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: matches } = await supabase
    .from('matches')
    .select(
      `*,
      collab_posts:post_id (id, title),
      partner_a:user_a (id, full_name, avatar_url),
      partner_b:user_b (id, full_name, avatar_url)`
    )
    .or(`user_a.eq.${user.id},user_b.eq.${user.id}`)
    .order('created_at', { ascending: false })

  // Fetch last message for each match
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const conversations = await Promise.all(
    ((matches as any[]) || []).map(async (match: any) => {
      const { data: lastMessage } = await supabase
        .from('messages')
        .select('*')
        .eq('match_id', match.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      const { count: unreadCount } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('match_id', match.id)
        .eq('is_read', false)
        .neq('sender_id', user.id)

      return {
        match,
        lastMessage: lastMessage as Message | null,
        unreadCount: unreadCount || 0,
      }
    })
  )

  // Merge with mock conversations
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let allConversations: any[] = conversations
  if (SHOW_MOCK_DATA) {
    allConversations = [...conversations, ...MOCK_CONVERSATIONS]
  }

  // Sort by last message time
  allConversations.sort((a, b) => {
    const aTime = a.lastMessage?.created_at || a.match.created_at
    const bTime = b.lastMessage?.created_at || b.match.created_at
    return new Date(bTime).getTime() - new Date(aTime).getTime()
  })

  return (
    <div className="space-y-4 py-4">
      <h1 className="text-2xl font-bold">Messages</h1>

      {allConversations.length > 0 ? (
        <div className="space-y-2">
          {allConversations.map(({ match, lastMessage, unreadCount }) => {
            const partner =
              match.user_a === user.id ? match.partner_b : match.partner_a

            return (
              <Link key={match.id} href={`/messages/${match.id}`}>
                <Card
                  className={`transition-colors hover:bg-muted/50 ${
                    unreadCount > 0 ? 'border-indigo-200 bg-indigo-50/50' : ''
                  }`}
                >
                  <CardContent className="flex items-center gap-3 p-3">
                    <div className="relative">
                      <Avatar className="h-12 w-12">
                        <AvatarImage
                          src={partner.avatar_url || undefined}
                        />
                        <AvatarFallback>
                          {partner.full_name?.charAt(0) || '?'}
                        </AvatarFallback>
                      </Avatar>
                      {unreadCount > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-indigo-600 px-1 text-[10px] font-medium text-white">
                          {unreadCount}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <p
                          className={`truncate font-medium ${
                            unreadCount > 0 ? 'font-semibold' : ''
                          }`}
                        >
                          {partner.full_name}
                        </p>
                        {lastMessage && (
                          <span className="shrink-0 text-xs text-muted-foreground">
                            {formatTime(lastMessage.created_at)}
                          </span>
                        )}
                      </div>
                      <p className="truncate text-sm text-muted-foreground">
                        {lastMessage
                          ? lastMessage.sender_id === user.id
                            ? `You: ${lastMessage.content}`
                            : lastMessage.content
                          : 'No messages yet — say hi!'}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      ) : (
        <div className="py-12 text-center">
          <p className="text-lg font-medium">No conversations yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Get matched with creators to start chatting!
          </p>
        </div>
      )}
    </div>
  )
}

function formatTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (days === 0) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
  if (days === 1) return 'Yesterday'
  if (days < 7) return date.toLocaleDateString([], { weekday: 'short' })
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
}
