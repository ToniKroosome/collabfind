'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { Heart, Check } from 'lucide-react'
import { useLanguage } from '@/lib/i18n'

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
  const { t } = useLanguage()

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
        toast.error(t('toast.alreadyInterested'))
        setSent(true)
      } else {
        toast.error(t('toast.failedInterest'))
      }
      setSending(false)
      setOpen(false)
      return
    }

    toast.success(t('toast.interestSent'))
    setSent(true)
    setSending(false)
    setOpen(false)
    router.refresh()
  }

  if (sent) {
    return (
      <Button disabled className="w-full" variant="outline">
        <Check className="mr-2 h-4 w-4" />
        {t('interest.interestSent')}
      </Button>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
          <Heart className="mr-2 h-4 w-4" />
          {t('interest.imInterested')}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('interest.expressInterest')}</DialogTitle>
          <DialogDescription>
            {t('interest.expressDescription')}
          </DialogDescription>
        </DialogHeader>
        <Textarea
          placeholder={t('interest.messagePlaceholder')}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={500}
          rows={4}
        />
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            {t('common.cancel')}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={sending}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            {sending ? t('interest.sending') : t('interest.sendInterest')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
