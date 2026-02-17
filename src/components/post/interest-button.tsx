'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { Heart, Check } from 'lucide-react'

interface InterestButtonProps {
  postId: string
  userId: string
  hasExpressedInterest: boolean
}

export function InterestButton({
  postId,
  userId,
  hasExpressedInterest,
}: InterestButtonProps) {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(hasExpressedInterest)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async () => {
    setSending(true)

    const { error } = await supabase.from('interests').insert({
      post_id: postId,
      user_id: userId,
      message: message.trim() || null,
      status: 'pending',
    })

    if (error) {
      if (error.code === '23505') {
        toast.error("You've already expressed interest")
        setSent(true)
      } else {
        toast.error('Failed to express interest')
      }
      setSending(false)
      setOpen(false)
      return
    }

    toast.success('Interest sent! The creator will be notified.')
    setSent(true)
    setSending(false)
    setOpen(false)
    router.refresh()
  }

  if (sent) {
    return (
      <Button disabled className="w-full" variant="outline">
        <Check className="mr-2 h-4 w-4" />
        Interest Sent
      </Button>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
          <Heart className="mr-2 h-4 w-4" />
          I&apos;m Interested
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Express Interest</DialogTitle>
          <DialogDescription>
            Send a short intro to the creator. This helps them understand why
            you&apos;d be a great collab partner!
          </DialogDescription>
        </DialogHeader>
        <Textarea
          placeholder="Hi! I'd love to collab because..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={500}
          rows={4}
        />
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={sending}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            {sending ? 'Sending...' : 'Send Interest'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
