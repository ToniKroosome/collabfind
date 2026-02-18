'use client'

import { useState } from 'react'
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
import { FileText } from 'lucide-react'
import { useLanguage } from '@/lib/i18n'

interface CreateContractDialogProps {
  matchId: string
  currentUserId: string
  partnerName: string
  userAId: string
  userBId: string
  onCreated?: () => void
}

export function CreateContractDialog({
  matchId,
  currentUserId,
  partnerName,
  userAId,
  userBId,
  onCreated,
}: CreateContractDialogProps) {
  const { t } = useLanguage()
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [requirementsA, setRequirementsA] = useState('')
  const [requirementsB, setRequirementsB] = useState('')
  const [deadline, setDeadline] = useState('')
  const [notes, setNotes] = useState('')
  const [creating, setCreating] = useState(false)
  const supabase = createClient()

  // Determine label names based on who is creating
  const isCurrentUserA = currentUserId === userAId
  const nameA = isCurrentUserA ? 'You' : partnerName
  const nameB = isCurrentUserA ? partnerName : 'You'

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast.error(t('toast.enterContractTitle' as any))
      return
    }
    if (!requirementsA.trim() || !requirementsB.trim()) {
      toast.error(t('toast.enterRequirements' as any))
      return
    }
    if (!deadline) {
      toast.error(t('toast.enterDeadline' as any))
      return
    }

    setCreating(true)

    const { error } = await supabase.from('collab_contracts').insert({
      match_id: matchId,
      created_by: currentUserId,
      title: title.trim(),
      requirements_a: requirementsA.trim(),
      requirements_b: requirementsB.trim(),
      deadline,
      notes: notes.trim() || null,
    })

    if (error) {
      toast.error(t('toast.failedCreateContract' as any))
      setCreating(false)
      return
    }

    toast.success(t('toast.contractCreated' as any))
    setOpen(false)
    setTitle('')
    setRequirementsA('')
    setRequirementsB('')
    setDeadline('')
    setNotes('')
    setCreating(false)
    onCreated?.()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">
          <FileText className="mr-1 h-3.5 w-3.5" />
          {t('contract.createContract' as any)}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('contract.createContract' as any)}</DialogTitle>
          <DialogDescription>
            {t('contract.requirementsFor' as any).replace('{name}', partnerName)}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="contract-title">{t('contract.title' as any)}</Label>
            <Input
              id="contract-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t('contract.titlePlaceholder' as any)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="requirements-a">
              {t('contract.requirementsFor' as any).replace('{name}', nameA)}
            </Label>
            <Textarea
              id="requirements-a"
              value={requirementsA}
              onChange={(e) => setRequirementsA(e.target.value)}
              placeholder={t('contract.requirementsPlaceholder' as any)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="requirements-b">
              {t('contract.requirementsFor' as any).replace('{name}', nameB)}
            </Label>
            <Textarea
              id="requirements-b"
              value={requirementsB}
              onChange={(e) => setRequirementsB(e.target.value)}
              placeholder={t('contract.requirementsPlaceholder' as any)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contract-deadline">{t('contract.deadline' as any)}</Label>
            <Input
              id="contract-deadline"
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contract-notes">{t('contract.notes' as any)}</Label>
            <Textarea
              id="contract-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t('contract.notesPlaceholder' as any)}
              rows={2}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              {t('common.cancel' as any)}
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={creating}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              {creating ? t('contract.creating' as any) : t('contract.create' as any)}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
