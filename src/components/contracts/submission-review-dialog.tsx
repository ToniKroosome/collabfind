'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { toast } from 'sonner'
import { CheckCircle, RotateCcw } from 'lucide-react'
import { useLanguage } from '@/lib/i18n'
import type { ContractSubmission } from '@/types/database'

interface SubmissionReviewDialogProps {
  submission: ContractSubmission
  currentUserId: string
  onReviewed?: () => void
}

export function SubmissionReviewDialog({
  submission,
  currentUserId,
  onReviewed,
}: SubmissionReviewDialogProps) {
  const { t } = useLanguage()
  const [approveOpen, setApproveOpen] = useState(false)
  const [revisionOpen, setRevisionOpen] = useState(false)
  const [revisionNote, setRevisionNote] = useState('')
  const [updating, setUpdating] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleApprove = async () => {
    setUpdating(true)

    const { error } = await supabase
      .from('contract_submissions')
      .update({
        status: 'approved',
        reviewed_by: currentUserId,
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', submission.id)

    if (error) {
      toast.error(t('toast.failedUpdateSubmission' as any))
      setUpdating(false)
      return
    }

    setApproveOpen(false)
    setUpdating(false)
    toast.success(t('toast.submissionApproved' as any))
    router.refresh()
    onReviewed?.()
  }

  const handleRequestRevision = async () => {
    setUpdating(true)

    const { error } = await supabase
      .from('contract_submissions')
      .update({
        status: 'revision_requested',
        revision_note: revisionNote.trim() || null,
        reviewed_by: currentUserId,
        reviewed_at: new Date().toISOString(),
      })
      .eq('id', submission.id)

    if (error) {
      toast.error(t('toast.failedUpdateSubmission' as any))
      setUpdating(false)
      return
    }

    setRevisionOpen(false)
    setRevisionNote('')
    setUpdating(false)
    toast.success(t('toast.revisionRequested' as any))
    router.refresh()
    onReviewed?.()
  }

  return (
    <div className="flex gap-2">
      <Dialog open={approveOpen} onOpenChange={setApproveOpen}>
        <DialogTrigger asChild>
          <Button size="sm" className="bg-green-600 hover:bg-green-700">
            <CheckCircle className="mr-1 h-3.5 w-3.5" />
            {t('submission.approve' as any)}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('submission.approveTitle' as any)}</DialogTitle>
            <DialogDescription>
              {t('submission.approveDesc' as any)}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setApproveOpen(false)}>
              {t('common.cancel' as any)}
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={handleApprove}
              disabled={updating}
            >
              {t('submission.approve' as any)}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={revisionOpen} onOpenChange={setRevisionOpen}>
        <DialogTrigger asChild>
          <Button size="sm" variant="outline">
            <RotateCcw className="mr-1 h-3.5 w-3.5" />
            {t('submission.requestRevision' as any)}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('submission.requestRevision' as any)}</DialogTitle>
            <DialogDescription>
              {t('submission.revisionNote' as any)}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="revision-note">
                {t('submission.revisionNote' as any)}
              </Label>
              <Textarea
                id="revision-note"
                value={revisionNote}
                onChange={(e) => setRevisionNote(e.target.value)}
                placeholder={t('submission.revisionNotePlaceholder' as any)}
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setRevisionOpen(false)}>
                {t('common.cancel' as any)}
              </Button>
              <Button
                variant="destructive"
                onClick={handleRequestRevision}
                disabled={updating}
              >
                {t('submission.requestRevision' as any)}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
