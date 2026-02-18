'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import type { Message, Profile, ContractWithSubmissions, Storyboard } from '@/types/database'
import { Send, FileText, Clapperboard } from 'lucide-react'
import { useLanguage } from '@/lib/i18n'
import { ChatContractBar } from '@/components/contracts/chat-contract-bar'
import { ContractPanel } from '@/components/contracts/contract-panel'
import { StoryboardPanel } from '@/components/storyboard/storyboard-panel'

interface ChatWindowProps {
  matchId: string
  currentUserId: string
  partner: Profile
  initialMessages: Message[]
  isMock?: boolean
  initialContract?: ContractWithSubmissions | null
  initialStoryboard?: Storyboard | null
  userAId?: string
  userBId?: string
  postOwnerId?: string
}

export function ChatWindow({
  matchId,
  currentUserId,
  partner,
  initialMessages,
  isMock = false,
  initialContract = null,
  initialStoryboard = null,
  userAId = '',
  userBId = '',
  postOwnerId = '',
}: ChatWindowProps) {
  const { t } = useLanguage()
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [content, setContent] = useState('')
  const [sending, setSending] = useState(false)
  const [contract, setContract] = useState<ContractWithSubmissions | null>(initialContract)
  const [storyboard, setStoryboard] = useState<Storyboard | null>(initialStoryboard)
  const [contractPanelOpen, setContractPanelOpen] = useState(false)
  const [storyboardPanelOpen, setStoryboardPanelOpen] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  // Get partner name for storyboard
  const currentUserName = userAId === currentUserId
    ? (partner.full_name || '?') // if current is A, partner is B — but we need our own name
    : (partner.full_name || '?')
  const userAName = userAId === currentUserId
    ? 'You'
    : (partner.full_name || '?')
  const userBName = userBId === currentUserId
    ? 'You'
    : (partner.full_name || '?')

  // Refresh contract data
  const refreshContract = useCallback(async () => {
    const { data } = await supabase
      .from('collab_contracts')
      .select('*, contract_submissions(*)')
      .eq('match_id', matchId)
      .order('created_at', { ascending: false })
      .limit(1)
    setContract((data?.[0] as ContractWithSubmissions) || null)
  }, [matchId, supabase])

  // Refresh storyboard data
  const refreshStoryboard = useCallback(async () => {
    const { data } = await supabase
      .from('storyboards')
      .select('*')
      .eq('match_id', matchId)
      .single()
    setStoryboard((data as Storyboard) || null)
  }, [matchId, supabase])

  // Auto-scroll to bottom
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    })
  }, [messages])

  // Mark messages as read (skip for mock data)
  useEffect(() => {
    if (isMock) return
    const markRead = async () => {
      await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('match_id', matchId)
        .neq('sender_id', currentUserId)
        .eq('is_read', false)
    }
    markRead()
  }, [matchId, currentUserId, supabase, isMock])

  // Real-time subscription (skip for mock data)
  useEffect(() => {
    if (isMock) return
    const channel = supabase
      .channel(`messages:${matchId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `match_id=eq.${matchId}`,
        },
        (payload) => {
          const newMessage = payload.new as Message
          setMessages((prev) => {
            // Avoid duplicates (by real ID)
            if (prev.some((m) => m.id === newMessage.id)) return prev

            // Replace optimistic message (temp-*) with the real one from the same sender
            const optimisticIndex = prev.findIndex(
              (m) =>
                m.id.startsWith('temp-') &&
                m.sender_id === newMessage.sender_id &&
                m.content === newMessage.content
            )
            if (optimisticIndex !== -1) {
              const updated = [...prev]
              updated[optimisticIndex] = newMessage
              return updated
            }

            return [...prev, newMessage]
          })

          // Mark as read if from partner
          if (newMessage.sender_id !== currentUserId) {
            supabase
              .from('messages')
              .update({ is_read: true })
              .eq('id', newMessage.id)
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [matchId, currentUserId, supabase, isMock])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim() || sending) return

    const messageContent = content.trim()
    setContent('')
    setSending(true)

    // Optimistic update
    const optimisticMessage: Message = {
      id: `temp-${Date.now()}`,
      match_id: matchId,
      sender_id: currentUserId,
      content: messageContent,
      is_read: false,
      created_at: new Date().toISOString(),
    }
    setMessages((prev) => [...prev, optimisticMessage])

    // For mock chats, just keep the optimistic message
    if (!isMock) {
      const { error } = await supabase.from('messages').insert({
        match_id: matchId,
        sender_id: currentUserId,
        content: messageContent,
      })

      if (error) {
        // Remove optimistic message on error
        setMessages((prev) => prev.filter((m) => m.id !== optimisticMessage.id))
        setContent(messageContent)
      }
    }

    setSending(false)
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 border-b px-4 py-3">
        <Avatar className="h-9 w-9">
          <AvatarImage src={partner.avatar_url || undefined} />
          <AvatarFallback className="text-sm">
            {partner.full_name?.charAt(0) || '?'}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <p className="font-semibold text-sm">{partner.full_name}</p>
          {partner.username && (
            <p className="text-xs text-muted-foreground">@{partner.username}</p>
          )}
        </div>
        {!isMock && userAId && (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setStoryboardPanelOpen(true)}
            >
              <Clapperboard className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setContractPanelOpen(true)}
            >
              <FileText className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Contract Status Bar */}
      {!isMock && userAId && (
        <ChatContractBar
          contract={contract}
          currentUserId={currentUserId}
          partner={partner}
          onOpenPanel={() => setContractPanelOpen(true)}
        />
      )}

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
        {messages.length === 0 && (
          <div className="flex h-full items-center justify-center">
            <p className="text-sm text-muted-foreground">
              {t('messages.sayHi').replace('{name}', partner.full_name?.split(' ')[0] || '')}
            </p>
          </div>
        )}
        {messages.map((message) => {
          const isOwn = message.sender_id === currentUserId
          return (
            <div
              key={message.id}
              className={cn('flex', isOwn ? 'justify-end' : 'justify-start')}
            >
              <div
                className={cn(
                  'max-w-[75%] rounded-2xl px-3.5 py-2 text-sm',
                  isOwn
                    ? 'bg-indigo-600 text-white rounded-br-md'
                    : 'bg-muted rounded-bl-md'
                )}
              >
                <p className="whitespace-pre-wrap break-words">
                  {message.content}
                </p>
                <p
                  className={cn(
                    'mt-0.5 text-[10px]',
                    isOwn ? 'text-indigo-200' : 'text-muted-foreground'
                  )}
                >
                  {new Date(message.created_at).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Input */}
      <form
        onSubmit={handleSend}
        className="flex items-center gap-2 border-t px-4 py-3"
      >
        <Input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={t('messages.typePlaceholder')}
          className="flex-1"
          autoComplete="off"
        />
        <Button
          type="submit"
          size="icon"
          disabled={!content.trim() || sending}
          className="shrink-0 bg-indigo-600 hover:bg-indigo-700"
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>

      {/* Contract Panel */}
      {!isMock && userAId && (
        <ContractPanel
          open={contractPanelOpen}
          onOpenChange={setContractPanelOpen}
          matchId={matchId}
          currentUserId={currentUserId}
          partner={partner}
          userAId={userAId}
          userBId={userBId}
          contract={contract}
          onContractChange={refreshContract}
        />
      )}

      {/* Storyboard Panel */}
      {!isMock && userAId && (
        <StoryboardPanel
          open={storyboardPanelOpen}
          onOpenChange={setStoryboardPanelOpen}
          matchId={matchId}
          currentUserId={currentUserId}
          storyboard={storyboard}
          userAId={userAId}
          userBId={userBId}
          userAName={userAName}
          userBName={userBName}
          postOwnerId={postOwnerId}
          onStoryboardChange={refreshStoryboard}
        />
      )}
    </div>
  )
}
