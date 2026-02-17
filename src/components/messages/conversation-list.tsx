'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { TimeAgo } from '@/components/shared/time-ago'
import { useLanguage } from '@/lib/i18n'

interface ConversationListProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  conversations: any[]
  currentUserId: string
}

export function ConversationList({ conversations, currentUserId }: ConversationListProps) {
  const { t } = useLanguage()

  return (
    <>
      <h1 className="text-2xl font-bold">{t('messages.title')}</h1>

      {conversations.length > 0 ? (
        <div className="space-y-2">
          {conversations.map(({ match, lastMessage, unreadCount }) => {
            const partner =
              match.user_a === currentUserId ? match.partner_b : match.partner_a

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
                            <TimeAgo date={lastMessage.created_at} />
                          </span>
                        )}
                      </div>
                      <p className="truncate text-sm text-muted-foreground">
                        {lastMessage
                          ? lastMessage.sender_id === currentUserId
                            ? `${t('messages.you')} ${lastMessage.content}`
                            : lastMessage.content
                          : t('messages.noMessagesYet')}
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
          <p className="text-lg font-medium">{t('messages.noConversations')}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {t('messages.getMatched')}
          </p>
        </div>
      )}
    </>
  )
}
