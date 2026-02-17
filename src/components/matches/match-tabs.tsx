'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { COLLAB_TYPES, MATCH_STATUS_COLORS } from '@/lib/constants'
import { TimeAgo } from '@/components/shared/time-ago'
import { MatchStatusControls } from '@/components/matches/match-status-controls'
import { ReviewForm } from '@/components/reviews/review-form'
import { MessageCircle } from 'lucide-react'
import Link from 'next/link'

interface MatchTabsProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  matches: any[]
  currentUserId: string
  reviewedMatchIds: string[]
}

export function MatchTabs({ matches, currentUserId, reviewedMatchIds }: MatchTabsProps) {
  const reviewedSet = new Set(reviewedMatchIds)

  const activeMatches = matches.filter((m) => (m.status || 'active') === 'active')
  const completedMatches = matches.filter((m) => m.status === 'completed')

  const renderMatch = (match: (typeof matches)[0]) => {
    const partner =
      match.user_a === currentUserId ? match.partner_b : match.partner_a
    const partnerId =
      match.user_a === currentUserId ? match.user_b : match.user_a
    const typeLabel =
      COLLAB_TYPES.find((t) => t.value === match.collab_posts?.collab_type)
        ?.label || match.collab_posts?.collab_type
    const status = match.status || 'active'
    const statusColor = MATCH_STATUS_COLORS[status] || MATCH_STATUS_COLORS.active
    const isMock = match.id?.startsWith('mock-')

    return (
      <Card key={match.id}>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Link href={`/profile/${partner.id}`}>
              <Avatar className="h-12 w-12">
                <AvatarImage src={partner.avatar_url || undefined} />
                <AvatarFallback>
                  {partner.full_name?.charAt(0) || '?'}
                </AvatarFallback>
              </Avatar>
            </Link>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <Link
                  href={`/profile/${partner.id}`}
                  className="font-semibold hover:underline"
                >
                  {partner.full_name}
                </Link>
                <Badge className={`${statusColor} text-[10px]`} variant="secondary">
                  {status}
                </Badge>
              </div>
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
                  Matched <TimeAgo date={match.created_at} />
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-3 flex items-center gap-2">
            <Link href={`/messages/${match.id}`}>
              <Button
                size="sm"
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                <MessageCircle className="mr-1 h-4 w-4" />
                Chat
              </Button>
            </Link>

            {status === 'active' && (
              <MatchStatusControls
                matchId={match.id}
                currentStatus={status}
                isMock={isMock}
              />
            )}

            {status === 'completed' && (
              <ReviewForm
                matchId={match.id}
                reviewerId={currentUserId}
                revieweeId={partnerId}
                revieweeName={partner.full_name || 'this creator'}
                alreadyReviewed={reviewedSet.has(match.id)}
                isMock={isMock}
              />
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  const emptyState = (
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
  )

  return (
    <Tabs defaultValue="active">
      <TabsList className="w-full">
        <TabsTrigger value="active" className="flex-1">
          Active ({activeMatches.length})
        </TabsTrigger>
        <TabsTrigger value="completed" className="flex-1">
          Completed ({completedMatches.length})
        </TabsTrigger>
        <TabsTrigger value="all" className="flex-1">
          All ({matches.length})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="active" className="mt-3 space-y-3">
        {activeMatches.length > 0
          ? activeMatches.map(renderMatch)
          : emptyState}
      </TabsContent>

      <TabsContent value="completed" className="mt-3 space-y-3">
        {completedMatches.length > 0
          ? completedMatches.map(renderMatch)
          : (
            <div className="py-12 text-center">
              <p className="text-sm text-muted-foreground">
                No completed collabs yet. Mark a collab as complete when you&apos;re done!
              </p>
            </div>
          )}
      </TabsContent>

      <TabsContent value="all" className="mt-3 space-y-3">
        {matches.length > 0 ? matches.map(renderMatch) : emptyState}
      </TabsContent>
    </Tabs>
  )
}
