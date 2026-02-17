'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { toast } from 'sonner'
import { CheckCircle, XCircle } from 'lucide-react'
import { useLanguage } from '@/lib/i18n'

interface MatchStatusControlsProps {
  matchId: string
  currentStatus: string
  isMock?: boolean
}

export function MatchStatusControls({
  matchId,
  currentStatus,
  isMock = false,
}: MatchStatusControlsProps) {
  const { t } = useLanguage()
  const [status, setStatus] = useState(currentStatus)
  const [updating, setUpdating] = useState(false)
  const [completeOpen, setCompleteOpen] = useState(false)
  const [cancelOpen, setCancelOpen] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  if (status !== 'active') return null

  const updateStatus = async (newStatus: 'completed' | 'cancelled') => {
    setUpdating(true)

    if (!isMock) {
      const { error } = await supabase
        .from('matches')
        .update({ status: newStatus })
        .eq('id', matchId)

      if (error) {
        toast.error(t('toast.failedUpdateStatus'))
        setUpdating(false)
        return
      }
    }

    setStatus(newStatus)
    setCompleteOpen(false)
    setCancelOpen(false)
    setUpdating(false)
    toast.success(
      newStatus === 'completed'
        ? t('toast.collabCompleted')
        : t('toast.collabCancelled')
    )
    router.refresh()
  }

  return (
    <div className="flex gap-2">
      <Dialog open={completeOpen} onOpenChange={setCompleteOpen}>
        <DialogTrigger asChild>
          <Button size="sm" className="bg-green-600 hover:bg-green-700">
            <CheckCircle className="mr-1 h-3.5 w-3.5" />
            {t('matches.complete')}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('matches.markCompleteTitle')}</DialogTitle>
            <DialogDescription>
              {t('matches.markCompleteDesc')}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setCompleteOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={() => updateStatus('completed')}
              disabled={updating}
            >
              {updating ? t('matches.updating') : t('matches.yesComplete')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={cancelOpen} onOpenChange={setCancelOpen}>
        <DialogTrigger asChild>
          <Button size="sm" variant="outline">
            <XCircle className="mr-1 h-3.5 w-3.5" />
            {t('matches.cancelCollab')}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('matches.cancelCollabTitle')}</DialogTitle>
            <DialogDescription>
              {t('matches.cancelCollabDesc')}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setCancelOpen(false)}>
              {t('matches.goBack')}
            </Button>
            <Button
              variant="destructive"
              onClick={() => updateStatus('cancelled')}
              disabled={updating}
            >
              {updating ? t('matches.updating') : t('matches.yesCancelCollab')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
