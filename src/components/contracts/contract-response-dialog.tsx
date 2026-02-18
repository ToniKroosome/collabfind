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
import type { CollabContract } from '@/types/database'

interface ContractResponseDialogProps {
  contract: CollabContract
  onResponded?: () => void
}

export function ContractResponseDialog({
  contract,
  onResponded,
}: ContractResponseDialogProps) {
  const { t } = useLanguage()
  const [acceptOpen, setAcceptOpen] = useState(false)
  const [declineOpen, setDeclineOpen] = useState(false)
  const [updating, setUpdating] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  if (contract.status !== 'pending') return null

  const handleResponse = async (newStatus: 'accepted' | 'declined') => {
    setUpdating(true)

    const { error } = await supabase
      .from('collab_contracts')
      .update({
        status: newStatus,
        responded_at: new Date().toISOString(),
      })
      .eq('id', contract.id)

    if (error) {
      toast.error(t('toast.failedUpdateContract' as any))
      setUpdating(false)
      return
    }

    setAcceptOpen(false)
    setDeclineOpen(false)
    setUpdating(false)
    toast.success(
      newStatus === 'accepted'
        ? t('toast.contractAccepted' as any)
        : t('toast.contractDeclined' as any)
    )
    router.refresh()
    onResponded?.()
  }

  return (
    <div className="flex gap-2">
      <Dialog open={acceptOpen} onOpenChange={setAcceptOpen}>
        <DialogTrigger asChild>
          <Button size="sm" className="bg-green-600 hover:bg-green-700">
            <CheckCircle className="mr-1 h-3.5 w-3.5" />
            {t('contract.accept' as any)}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('contract.acceptTitle' as any)}</DialogTitle>
            <DialogDescription>
              {t('contract.acceptDesc' as any)}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setAcceptOpen(false)}>
              {t('common.cancel' as any)}
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={() => handleResponse('accepted')}
              disabled={updating}
            >
              {t('contract.accept' as any)}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={declineOpen} onOpenChange={setDeclineOpen}>
        <DialogTrigger asChild>
          <Button size="sm" variant="outline">
            <XCircle className="mr-1 h-3.5 w-3.5" />
            {t('contract.decline' as any)}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('contract.declineTitle' as any)}</DialogTitle>
            <DialogDescription>
              {t('contract.declineDesc' as any)}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDeclineOpen(false)}>
              {t('common.cancel' as any)}
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleResponse('declined')}
              disabled={updating}
            >
              {t('contract.decline' as any)}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
