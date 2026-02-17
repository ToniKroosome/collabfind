'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState, useRef } from 'react'

export function useNotifications(userId: string | undefined) {
  const [unreadCount, setUnreadCount] = useState(0)
  const supabaseRef = useRef(createClient())

  useEffect(() => {
    if (!userId) return

    const supabase = supabaseRef.current

    // Delay initial fetch so it doesn't block first paint
    const timer = setTimeout(async () => {
      const { count } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('is_read', false)
      setUnreadCount(count ?? 0)
    }, 500)

    const channel = supabase
      .channel(`notifications:${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        () => {
          setUnreadCount((prev) => prev + 1)
        }
      )
      .subscribe()

    return () => {
      clearTimeout(timer)
      supabase.removeChannel(channel)
    }
  }, [userId])

  const resetCount = () => setUnreadCount(0)

  return { unreadCount, resetCount }
}
