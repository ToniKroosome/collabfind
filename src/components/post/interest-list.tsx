'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import type { InterestWithProfile } from '@/types/database'
import { toast } from 'sonner'
import { TimeAgo } from '@/components/shared/time-ago'
import Link from 'next/link'
import { Check, X, MessageCircle } from 'lucide-react'
import { useLanguage } from '@/lib/i18n'

interface InterestListProps {
  interests: InterestWithProfile[]
  maxCollaborators?: number
  collabMode?: string
}

export function InterestList({
  interests: initialInterests,
  maxCollaborators = 1,
  collabMode = 'separate',
}: InterestListProps) {
  const [interests, setInterests] = useState(initialInterests)
  const router = useRouter()
  const supabase = createClient()
  const { t } = useLanguage()

  const acceptedCount = interests.filter((i) => i.status === 'accepted').length
  const slotsFull = acceptedCount >= maxCollaborators

  const handleAction = async (interestId: string, action: 'accepted' | 'declined') => {
    const { error } = await supabase
      .from('interests')
      .update({ status: action })
      .eq('id', interestId)

    if (error) {
      toast.error(t('toast.failedAcceptDecline'))
      return
    }

    setInterests((prev) =>
      prev.map((i) => (i.id === interestId ? { ...i, status: action } : i))
    )

    toast.success(
      action === 'accepted'
        ? t('toast.interestAccepted')
        : t('toast.interestDeclined')
    )

    // Single-collab mode: redirect to chat after accept
    if (action === 'accepted' && maxCollaborators === 1) {
      const { data: match } = await supabase
        .from('matches')
        .select('id')
        .eq('interest_id', interestId)
        .single()

      if (match) {
        router.push(`/messages/${match.id}`)
        return
      }
    }

    router.refresh()
  }

  const handleViewChat = async (interest: InterestWithProfile) => {
    if (collabMode === 'group') {
      // Group mode: find the single group match for this post
      const { data: match } = await supabase
        .from('matches')
        .select('id')
        .eq('post_id', interest.post_id)
        .eq('collab_mode', 'group')
        .eq('status', 'active')
        .limit(1)
        .maybeSingle()
      if (match) router.push(`/messages/${match.id}`)
    } else {
      // Separate mode: find the 1-on-1 match for this user
      const { data: match } = await supabase
        .from('matches')
        .select('id')
        .eq('post_id', interest.post_id)
        .eq('user_b', interest.user_id)
        .eq('status', 'active')
        .limit(1)
        .maybeSingle()
      if (match) router.push(`/messages/${match.id}`)
    }
  }

  if (interests.length === 0) {
    return (
      <p className="py-4 text-center text-sm text-muted-foreground">
        {t('interest.noInterestsYet')}
      </p>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">
          {t('interest.interests')} ({interests.length})
        </h3>
        {maxCollaborators > 1 && (
          <span className="text-sm text-muted-foreground">
            {t('collab.slotsProgress')
              .replace('{accepted}', String(acceptedCount))
              .replace('{max}', String(maxCollaborators))}
          </span>
        )}
      </div>
      {interests.map((interest) => (
        <Card key={interest.id}>
          <CardContent className="p-3">
            <div className="flex items-start gap-3">
              <Link href={`/profile/${interest.profiles.id}`}>
                <Avatar className="h-10 w-10">
                  <AvatarImage src={interest.profiles.avatar_url || undefined} />
                  <AvatarFallback className="text-sm">
                    {interest.profiles.full_name?.charAt(0) || '?'}
                  </AvatarFallback>
                </Avatar>
              </Link>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <Link
                    href={`/profile/${interest.profiles.id}`}
                    className="font-medium hover:underline"
                  >
                    {interest.profiles.full_name}
                  </Link>
                  <StatusBadge status={interest.status} />
                </div>
                {interest.profiles.niche.length > 0 && (
                  <div className="mt-0.5 flex gap-1">
                    {interest.profiles.niche.slice(0, 3).map((n) => (
                      <span key={n} className="text-xs text-muted-foreground capitalize">
                        {n}
                      </span>
                    ))}
                  </div>
                )}
                {interest.message && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    &quot;{interest.message}&quot;
                  </p>
                )}
                <p className="mt-1 text-xs text-muted-foreground">
                  <TimeAgo date={interest.created_at} />
                </p>
              </div>
            </div>
            {interest.status === 'pending' && (
              <div className="mt-3 flex gap-2">
                <Button
                  size="sm"
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  onClick={() => handleAction(interest.id, 'accepted')}
                  disabled={slotsFull}
                >
                  <Check className="mr-1 h-4 w-4" />
                  {t('interest.accept')}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => handleAction(interest.id, 'declined')}
                >
                  <X className="mr-1 h-4 w-4" />
                  {t('interest.decline')}
                </Button>
              </div>
            )}
            {interest.status === 'accepted' && maxCollaborators > 1 && (
              <div className="mt-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs"
                  onClick={() => handleViewChat(interest)}
                >
                  <MessageCircle className="mr-1 h-3 w-3" />
                  {t('collab.viewChat')}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const { t } = useLanguage()

  if (status === 'accepted') {
    return <Badge className="bg-green-100 text-green-700 text-xs">{t('interest.accepted')}</Badge>
  }
  if (status === 'declined') {
    return <Badge className="bg-red-100 text-red-700 text-xs">{t('interest.declined')}</Badge>
  }
  return <Badge className="bg-yellow-100 text-yellow-700 text-xs">{t('interest.pending')}</Badge>
}
