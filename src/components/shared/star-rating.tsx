'use client'

import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StarRatingProps {
  rating: number
  maxStars?: number
  size?: 'sm' | 'md'
  interactive?: boolean
  onRate?: (rating: number) => void
}

export function StarRating({
  rating,
  maxStars = 5,
  size = 'sm',
  interactive = false,
  onRate,
}: StarRatingProps) {
  const sizeClass = size === 'sm' ? 'h-3.5 w-3.5' : 'h-4.5 w-4.5'

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: maxStars }, (_, i) => {
        const filled = i < Math.round(rating)
        return (
          <Star
            key={i}
            className={cn(
              sizeClass,
              filled ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300',
              interactive && 'cursor-pointer hover:text-yellow-400'
            )}
            onClick={() => interactive && onRate?.(i + 1)}
          />
        )
      })}
    </div>
  )
}
