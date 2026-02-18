'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
import { Upload } from 'lucide-react'
import { useLanguage } from '@/lib/i18n'

interface SubmitWorkDialogProps {
  contractId: string
  currentUserId: string
  onSubmitted?: () => void
}

export function SubmitWorkDialog({
  contractId,
  currentUserId,
  onSubmitted,
}: SubmitWorkDialogProps) {
  const { t } = useLanguage()
  const [open, setOpen] = useState(false)
  const [description, setDescription] = useState('')
  const [proofUrl, setProofUrl] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async () => {
    if (!description.trim()) {
      toast.error(t('toast.enterSubmissionDesc' as any))
      return
    }

    setSubmitting(true)

    const { error } = await supabase.from('contract_submissions').insert({
      contract_id: contractId,
      submitted_by: currentUserId,
      description: description.trim(),
      proof_url: proofUrl.trim() || null,
    })

    if (error) {
      toast.error(t('toast.failedCreateSubmission' as any))
      setSubmitting(false)
      return
    }

    toast.success(t('toast.submissionCreated' as any))
    setOpen(false)
    setDescription('')
    setProofUrl('')
    setSubmitting(false)
    router.refresh()
    onSubmitted?.()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">
          <Upload className="mr-1 h-3.5 w-3.5" />
          {t('submission.submitWork' as any)}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('submission.submitWork' as any)}</DialogTitle>
          <DialogDescription>
            {t('submission.description' as any)}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="submission-description">
              {t('submission.description' as any)}
            </Label>
            <Textarea
              id="submission-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('submission.descriptionPlaceholder' as any)}
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="submission-proof-url">
              {t('submission.proofUrl' as any)}
            </Label>
            <Input
              id="submission-proof-url"
              value={proofUrl}
              onChange={(e) => setProofUrl(e.target.value)}
              placeholder={t('submission.proofUrlPlaceholder' as any)}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              {t('common.cancel' as any)}
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={submitting}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              {submitting
                ? t('submission.submitting' as any)
                : t('submission.submit' as any)}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
