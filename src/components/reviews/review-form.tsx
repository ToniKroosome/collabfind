'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { StarRating } from '@/components/shared/star-rating'
import { toast } from 'sonner'
import { Star, CheckCircle } from 'lucide-react'

interface ReviewFormProps {
  matchId: string
  reviewerId: string
  revieweeId: string
  revieweeName: string
  alreadyReviewed?: boolean
  isMock?: boolean
}

export function ReviewForm({
  matchId,
  reviewerId,
  revieweeId,
  revieweeName,
  alreadyReviewed = false,
  isMock = false,
}: ReviewFormProps) {
  const [open, setOpen] = useState(false)
  const [rating, setRating] = useState(0)
  const [reviewText, setReviewText] = useState('')
  const [sending, setSending] = useState(false)
  const [submitted, setSubmitted] = useState(alreadyReviewed)
  const router = useRouter()
  const supabase = createClient()

  if (submitted) {
    return (
      <Button size="sm" variant="outline" disabled>
        <CheckCircle className="mr-1 h-3.5 w-3.5 text-green-500" />
        Reviewed
      </Button>
    )
  }

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error('Please select a rating')
      return
    }

    setSending(true)

    if (!isMock) {
      const { error } = await supabase.from('collab_reviews').insert({
        match_id: matchId,
        reviewer_id: reviewerId,
        reviewee_id: revieweeId,
        rating,
        review_text: reviewText.trim() || null,
      })

      if (error) {
        toast.error('Failed to submit review')
        setSending(false)
        return
      }
    }

    setSubmitted(true)
    setOpen(false)
    setSending(false)
    toast.success('Review submitted!')
    router.refresh()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Star className="mr-1 h-3.5 w-3.5" />
          Review
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Review {revieweeName}</DialogTitle>
          <DialogDescription>
            How was your collab experience? Your review helps others find great partners.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm font-medium">Rating</p>
            <StarRating
              rating={rating}
              size="md"
              interactive
              onRate={setRating}
            />
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">Review (optional)</p>
            <Textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Share your experience working together..."
              maxLength={300}
              rows={3}
            />
            <p className="text-xs text-muted-foreground">
              {reviewText.length}/300
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={rating === 0 || sending}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              {sending ? 'Submitting...' : 'Submit Review'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
