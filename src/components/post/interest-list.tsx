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
import { Check, X } from 'lucide-react'

interface InterestListProps {
  interests: InterestWithProfile[]
}

export function InterestList({ interests: initialInterests }: InterestListProps) {
  const [interests, setInterests] = useState(initialInterests)
  const router = useRouter()
  const supabase = createClient()

  const handleAction = async (interestId: string, action: 'accepted' | 'declined') => {
    const { error } = await supabase
      .from('interests')
      .update({ status: action })
      .eq('id', interestId)

    if (error) {
      toast.error(`Failed to ${action === 'accepted' ? 'accept' : 'decline'}`)
      return
    }

    setInterests((prev) =>
      prev.map((i) => (i.id === interestId ? { ...i, status: action } : i))
    )

    toast.success(
      action === 'accepted'
        ? "Interest accepted! You're now matched."
        : 'Interest declined.'
    )
    router.refresh()
  }

  if (interests.length === 0) {
    return (
      <p className="py-4 text-center text-sm text-muted-foreground">
        No one has expressed interest yet.
      </p>
    )
  }

  return (
    <div className="space-y-3">
      <h3 className="font-semibold">
        Interests ({interests.length})
      </h3>
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
                >
                  <Check className="mr-1 h-4 w-4" />
                  Accept
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => handleAction(interest.id, 'declined')}
                >
                  <X className="mr-1 h-4 w-4" />
                  Decline
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
  if (status === 'accepted') {
    return <Badge className="bg-green-100 text-green-700 text-xs">Accepted</Badge>
  }
  if (status === 'declined') {
    return <Badge className="bg-red-100 text-red-700 text-xs">Declined</Badge>
  }
  return <Badge className="bg-yellow-100 text-yellow-700 text-xs">Pending</Badge>
}
