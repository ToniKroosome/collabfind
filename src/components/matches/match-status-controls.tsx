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
        toast.error('Failed to update status')
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
        ? 'Collab marked as completed!'
        : 'Collab cancelled'
    )
    router.refresh()
  }

  return (
    <div className="flex gap-2">
      <Dialog open={completeOpen} onOpenChange={setCompleteOpen}>
        <DialogTrigger asChild>
          <Button size="sm" className="bg-green-600 hover:bg-green-700">
            <CheckCircle className="mr-1 h-3.5 w-3.5" />
            Complete
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mark as Completed?</DialogTitle>
            <DialogDescription>
              This means the collab is done. Both of you will be able to leave reviews for each other.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setCompleteOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={() => updateStatus('completed')}
              disabled={updating}
            >
              {updating ? 'Updating...' : 'Yes, Mark Complete'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={cancelOpen} onOpenChange={setCancelOpen}>
        <DialogTrigger asChild>
          <Button size="sm" variant="outline">
            <XCircle className="mr-1 h-3.5 w-3.5" />
            Cancel
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel this collab?</DialogTitle>
            <DialogDescription>
              This will mark the collab as cancelled. You can still message each other.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setCancelOpen(false)}>
              Go Back
            </Button>
            <Button
              variant="destructive"
              onClick={() => updateStatus('cancelled')}
              disabled={updating}
            >
              {updating ? 'Updating...' : 'Yes, Cancel Collab'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
