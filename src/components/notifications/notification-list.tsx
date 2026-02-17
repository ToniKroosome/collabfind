'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Heart, Check, X, MessageCircle, Users, Star, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { TimeAgo } from '@/components/shared/time-ago'
import type { Notification } from '@/types/database'

interface NotificationListProps {
  notifications: Notification[]
}

const ICONS: Record<string, typeof Heart> = {
  new_interest: Heart,
  interest_accepted: Check,
  interest_declined: X,
  new_message: MessageCircle,
  new_match: Users,
  new_review: Star,
  collab_completed: CheckCircle,
}

const ICON_COLORS: Record<string, string> = {
  new_interest: 'text-pink-500 bg-pink-50',
  interest_accepted: 'text-green-500 bg-green-50',
  interest_declined: 'text-gray-400 bg-gray-50',
  new_message: 'text-blue-500 bg-blue-50',
  new_match: 'text-indigo-500 bg-indigo-50',
  new_review: 'text-yellow-500 bg-yellow-50',
  collab_completed: 'text-green-500 bg-green-50',
}

export function NotificationList({ notifications: initial }: NotificationListProps) {
  const [notifications, setNotifications] = useState(initial)
  const router = useRouter()
  const supabase = createClient()

  const handleClick = async (notification: Notification) => {
    // Mark as read
    if (!notification.is_read) {
      await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notification.id)

      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notification.id ? { ...n, is_read: true } : n
        )
      )
    }

    // Navigate based on type
    const data = (notification.data || {}) as Record<string, string>
    if (notification.type === 'new_interest' && data.post_id) {
      router.push(`/post/${data.post_id}`)
    } else if (notification.type === 'interest_accepted' && data.post_id) {
      router.push('/matches')
    } else if (notification.type === 'new_message') {
      router.push('/messages')
    } else if (notification.type === 'new_match') {
      router.push('/matches')
    } else if (notification.type === 'new_review') {
      router.push('/matches')
    } else if (notification.type === 'collab_completed') {
      router.push('/matches')
    }
  }

  const markAllRead = async () => {
    const unreadIds = notifications.filter((n) => !n.is_read).map((n) => n.id)
    if (unreadIds.length === 0) return

    await supabase
      .from('notifications')
      .update({ is_read: true })
      .in('id', unreadIds)

    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })))
  }

  const unreadCount = notifications.filter((n) => !n.is_read).length

  if (notifications.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-lg font-medium">No notifications</p>
        <p className="mt-1 text-sm text-muted-foreground">
          You&apos;ll be notified when someone is interested in your collabs!
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {unreadCount > 0 && (
        <div className="flex justify-end">
          <Button variant="ghost" size="sm" onClick={markAllRead} className="text-xs">
            Mark all as read
          </Button>
        </div>
      )}

      {notifications.map((notification) => {
        const Icon = ICONS[notification.type] || Heart
        const iconColor = ICON_COLORS[notification.type] || 'text-gray-400 bg-gray-50'

        return (
          <Card
            key={notification.id}
            className={cn(
              'cursor-pointer transition-colors hover:bg-muted/50',
              !notification.is_read && 'border-indigo-200 bg-indigo-50/30'
            )}
            onClick={() => handleClick(notification)}
          >
            <CardContent className="flex items-start gap-3 p-3">
              <div
                className={cn(
                  'flex h-9 w-9 shrink-0 items-center justify-center rounded-full',
                  iconColor
                )}
              >
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p
                  className={cn(
                    'text-sm',
                    !notification.is_read ? 'font-semibold' : 'font-medium'
                  )}
                >
                  {notification.title}
                </p>
                {notification.body && (
                  <p className="mt-0.5 text-sm text-muted-foreground line-clamp-2">
                    {notification.body}
                  </p>
                )}
                <p className="mt-1 text-xs text-muted-foreground">
                  <TimeAgo date={notification.created_at} />
                </p>
              </div>
              {!notification.is_read && (
                <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-indigo-600" />
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
