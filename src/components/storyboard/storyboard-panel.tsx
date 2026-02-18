'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { Plus, Save, FileText } from 'lucide-react'
import { useLanguage } from '@/lib/i18n'
import { StoryboardSlot } from '@/components/storyboard/storyboard-slot'
import type { Json } from '@/types/database'
import type { Storyboard, StoryboardSlot as StoryboardSlotType } from '@/types/database'

interface StoryboardPanelProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  matchId: string
  currentUserId: string
  storyboard: Storyboard | null
  userAId: string
  userBId: string
  userAName: string
  userBName: string
  postOwnerId: string
  onStoryboardChange: () => void
}

export function StoryboardPanel({
  open,
  onOpenChange,
  matchId,
  currentUserId,
  storyboard,
  userAId,
  userBId,
  userAName,
  userBName,
  postOwnerId,
  onStoryboardChange,
}: StoryboardPanelProps) {
  const { t } = useLanguage()
  const supabase = createClient()
  const isOwner = currentUserId === postOwnerId

  const [slots, setSlots] = useState<StoryboardSlotType[]>([])
  const [saving, setSaving] = useState(false)
  const [creating, setCreating] = useState(false)

  // Initialize slots from storyboard data
  useEffect(() => {
    if (storyboard) {
      const parsed = (storyboard.slots as StoryboardSlotType[] | null) || []
      setSlots(parsed)
    } else {
      setSlots([])
    }
  }, [storyboard])

  const handleCreateStoryboard = async () => {
    setCreating(true)

    const { error } = await supabase.from('storyboards').insert({
      match_id: matchId,
      created_by: currentUserId,
      slots: [] as unknown as Json,
    })

    if (error) {
      toast.error(t('toast.failedSaveStoryboard'))
      setCreating(false)
      return
    }

    setCreating(false)
    onStoryboardChange()
  }

  const handleAddSlot = () => {
    const newSlot: StoryboardSlotType = {
      order: slots.length + 1,
      description: '',
      assigned_to: userAId,
    }
    setSlots([...slots, newSlot])
  }

  const handleUpdateSlot = (index: number, updatedSlot: StoryboardSlotType) => {
    const newSlots = [...slots]
    newSlots[index] = updatedSlot
    setSlots(newSlots)
  }

  const handleDeleteSlot = (index: number) => {
    const newSlots = slots.filter((_, i) => i !== index)
    // Re-number remaining slots
    const renumbered = newSlots.map((slot, i) => ({
      ...slot,
      order: i + 1,
    }))
    setSlots(renumbered)
  }

  const handleMoveUp = (index: number) => {
    if (index === 0) return
    const newSlots = [...slots]
    const temp = newSlots[index]
    newSlots[index] = newSlots[index - 1]
    newSlots[index - 1] = temp
    // Re-number
    const renumbered = newSlots.map((slot, i) => ({
      ...slot,
      order: i + 1,
    }))
    setSlots(renumbered)
  }

  const handleMoveDown = (index: number) => {
    if (index >= slots.length - 1) return
    const newSlots = [...slots]
    const temp = newSlots[index]
    newSlots[index] = newSlots[index + 1]
    newSlots[index + 1] = temp
    // Re-number
    const renumbered = newSlots.map((slot, i) => ({
      ...slot,
      order: i + 1,
    }))
    setSlots(renumbered)
  }

  const handleSave = async () => {
    if (!storyboard) return
    setSaving(true)

    const { error } = await supabase
      .from('storyboards')
      .update({ slots: slots as unknown as Json })
      .eq('id', storyboard.id)

    if (error) {
      toast.error(t('toast.failedSaveStoryboard'))
      setSaving(false)
      return
    }

    setSaving(false)
    toast.success(t('toast.storyboardSaved'))
    onStoryboardChange()
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex flex-col">
        {!storyboard ? (
          <>
            <SheetHeader>
              <SheetTitle>{t('storyboard.storyboard')}</SheetTitle>
              <SheetDescription>
                {t('storyboard.noStoryboard')}
              </SheetDescription>
            </SheetHeader>
            <div className="flex flex-1 flex-col items-center justify-center gap-4 p-4">
              <FileText className="h-12 w-12 text-muted-foreground" />
              <p className="text-center text-sm text-muted-foreground">
                {t('storyboard.noStoryboardHint')}
              </p>
              {isOwner && (
                <Button
                  onClick={handleCreateStoryboard}
                  disabled={creating}
                  className="bg-indigo-600 hover:bg-indigo-700"
                >
                  {t('storyboard.createStoryboard')}
                </Button>
              )}
            </div>
          </>
        ) : (
          <>
            <SheetHeader>
              <SheetTitle>{t('storyboard.storyboard')}</SheetTitle>
              <SheetDescription>
                {t('storyboard.noStoryboardHint')}
              </SheetDescription>
            </SheetHeader>

            <Separator />

            {/* Slot list */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-3">
                {slots.map((slot, index) => (
                  <StoryboardSlot
                    key={index}
                    slot={slot}
                    index={index}
                    isOwner={isOwner}
                    userAName={userAName}
                    userBName={userBName}
                    userAId={userAId}
                    userBId={userBId}
                    onUpdate={(updatedSlot) => handleUpdateSlot(index, updatedSlot)}
                    onDelete={() => handleDeleteSlot(index)}
                    onMoveUp={() => handleMoveUp(index)}
                    onMoveDown={() => handleMoveDown(index)}
                    isFirst={index === 0}
                    isLast={index === slots.length - 1}
                  />
                ))}

                {slots.length === 0 && (
                  <p className="py-8 text-center text-sm text-muted-foreground">
                    {t('storyboard.noStoryboardHint')}
                  </p>
                )}
              </div>
            </div>

            {/* Bottom actions for owner */}
            {isOwner && (
              <div className="flex flex-col gap-2 border-t p-4">
                <Button
                  variant="outline"
                  onClick={handleAddSlot}
                  className="w-full"
                >
                  <Plus className="mr-1 h-4 w-4" />
                  {t('storyboard.addSlot')}
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full bg-indigo-600 hover:bg-indigo-700"
                >
                  <Save className="mr-1 h-4 w-4" />
                  {saving ? t('storyboard.saving') : t('storyboard.save')}
                </Button>
              </div>
            )}
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
