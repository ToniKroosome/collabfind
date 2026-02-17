import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ChatWindow } from '@/components/messages/chat-window'
import { SHOW_MOCK_DATA, getMockMatch, MOCK_MESSAGES } from '@/lib/mock-data'
import type { Message, Profile } from '@/types/database'

export default async function ChatPage({
  params,
}: {
  params: Promise<{ matchId: string }>
}) {
  const { matchId } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Handle mock match IDs
  if (SHOW_MOCK_DATA && matchId.startsWith('mock-')) {
    const mockMatch = getMockMatch(matchId)
    if (!mockMatch) notFound()

    const partner = (mockMatch.partner_b) as unknown as Profile
    const messages = (MOCK_MESSAGES[matchId] || []) as unknown as Message[]

    return (
      <ChatWindow
        matchId={matchId}
        currentUserId={mockMatch.user_a}
        partner={partner}
        initialMessages={messages}
        isMock={true}
      />
    )
  }

  // Verify match exists and user is a participant
  const { data: match } = await supabase
    .from('matches')
    .select(
      `*,
      partner_a:user_a (*),
      partner_b:user_b (*)`
    )
    .eq('id', matchId)
    .single()

  if (!match) notFound()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const m = match as any
  if (m.user_a !== user.id && m.user_b !== user.id) notFound()

  const partner = (
    m.user_a === user.id ? m.partner_b : m.partner_a
  ) as Profile

  // Fetch messages
  const { data: messages } = await supabase
    .from('messages')
    .select('*')
    .eq('match_id', matchId)
    .order('created_at', { ascending: true })
    .limit(100)

  return (
    <ChatWindow
      matchId={matchId}
      currentUserId={user.id}
      partner={partner}
      initialMessages={(messages as Message[]) || []}
    />
  )
}
