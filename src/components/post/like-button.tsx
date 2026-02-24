'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Heart } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LikeButtonProps {
  postId: string
  userId: string | null
  initialLiked: boolean
  initialCount: number
}

export function LikeButton({ postId, userId, initialLiked, initialCount }: LikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked)
  const [count, setCount] = useState(initialCount)
  const [loading, setLoading] = useState(false)

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!userId || loading) return

    setLoading(true)
    const supabase = createClient()

    if (liked) {
      const { error } = await supabase
        .from('post_likes')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', userId)

      if (!error) {
        setLiked(false)
        setCount((c) => Math.max(0, c - 1))
      }
    } else {
      const { error } = await supabase
        .from('post_likes')
        .insert({ post_id: postId, user_id: userId })

      if (!error) {
        setLiked(true)
        setCount((c) => c + 1)
      }
    }

    setLoading(false)
  }

  return (
    <button
      onClick={handleToggle}
      disabled={!userId || loading}
      className={cn(
        'flex items-center gap-1 text-xs transition-colors',
        liked
          ? 'text-red-500'
          : 'text-muted-foreground hover:text-red-500',
        !userId && 'cursor-default'
      )}
    >
      <Heart
        className={cn('h-4 w-4 transition-all', liked && 'fill-red-500')}
      />
      {count > 0 && <span>{count}</span>}
    </button>
  )
}
