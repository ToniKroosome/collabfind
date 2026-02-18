import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ChatWindow } from '@/components/messages/chat-window'
import { SHOW_MOCK_DATA, getMockMatch, MOCK_MESSAGES } from '@/lib/mock-data'
import type { Message, Profile, ContractWithSubmissions, Storyboard } from '@/types/database'

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

  // Fetch messages, contract, storyboard, and post owner in parallel
  const [
    { data: messages },
    { data: contracts },
    { data: storyboard },
    { data: post },
  ] = await Promise.all([
    supabase
      .from('messages')
      .select('*')
      .eq('match_id', matchId)
      .order('created_at', { ascending: true })
      .limit(100),
    supabase
      .from('collab_contracts')
      .select('*, contract_submissions(*)')
      .eq('match_id', matchId)
      .order('created_at', { ascending: false })
      .limit(1),
    supabase
      .from('storyboards')
      .select('*')
      .eq('match_id', matchId)
      .single(),
    supabase
      .from('collab_posts')
      .select('user_id')
      .eq('id', m.post_id)
      .single(),
  ])

  const latestContract = (contracts?.[0] as ContractWithSubmissions) || null
  const storyboardData = (storyboard as Storyboard) || null
  const postOwnerId = post?.user_id || m.user_a

  return (
    <ChatWindow
      matchId={matchId}
      currentUserId={user.id}
      partner={partner}
      initialMessages={(messages as Message[]) || []}
      initialContract={latestContract}
      initialStoryboard={storyboardData}
      userAId={m.user_a}
      userBId={m.user_b}
      postOwnerId={postOwnerId}
    />
  )
}
