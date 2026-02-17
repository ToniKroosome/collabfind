import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { SHOW_MOCK_DATA, MOCK_CONVERSATIONS } from '@/lib/mock-data'
import { ConversationList } from '@/components/messages/conversation-list'
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
      <ConversationList
        conversations={allConversations}
        currentUserId={user.id}
      />
    </div>
  )
}
