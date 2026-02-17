import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { StarRating } from '@/components/shared/star-rating'
import { TimeAgo } from '@/components/shared/time-ago'
import type { CollabReviewWithProfile } from '@/types/database'

interface ReviewListProps {
  reviews: CollabReviewWithProfile[]
}

export function ReviewList({ reviews }: ReviewListProps) {
  if (reviews.length === 0) return null

  return (
    <div className="space-y-3">
      {reviews.map((review) => (
        <div key={review.id} className="rounded-lg border p-3">
          <div className="flex items-center gap-2">
            <Avatar className="h-7 w-7">
              <AvatarImage src={review.profiles?.avatar_url || undefined} />
              <AvatarFallback className="text-xs">
                {review.profiles?.full_name?.charAt(0) || '?'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-sm font-medium">
                {review.profiles?.full_name || 'Unknown'}
              </p>
            </div>
            <span className="text-xs text-muted-foreground">
              <TimeAgo date={review.created_at} />
            </span>
          </div>
          <div className="mt-1.5">
            <StarRating rating={review.rating} size="sm" />
          </div>
          {review.review_text && (
            <p className="mt-1.5 text-sm text-muted-foreground">
              {review.review_text}
            </p>
          )}
        </div>
      ))}
    </div>
  )
}
