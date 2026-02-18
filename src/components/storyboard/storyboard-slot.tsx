'use client'

import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ChevronUp, ChevronDown, Trash2 } from 'lucide-react'
import { useLanguage } from '@/lib/i18n'
import type { StoryboardSlot as StoryboardSlotType } from '@/types/database'

interface StoryboardSlotProps {
  slot: StoryboardSlotType
  index: number
  isOwner: boolean
  userAName: string
  userBName: string
  userAId: string
  userBId: string
  onUpdate: (slot: StoryboardSlotType) => void
  onDelete: () => void
  onMoveUp: () => void
  onMoveDown: () => void
  isFirst: boolean
  isLast: boolean
}

export function StoryboardSlot({
  slot,
  index,
  isOwner,
  userAName,
  userBName,
  userAId,
  userBId,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}: StoryboardSlotProps) {
  const { t } = useLanguage()

  const assignedName =
    slot.assigned_to === userAId
      ? userAName
      : slot.assigned_to === userBId
        ? userBName
        : ''

  return (
    <div className="space-y-2 rounded-lg border p-3">
      {/* Row 1: Order badge + Description */}
      <div className="flex items-center gap-2">
        <Badge
          variant="secondary"
          className="h-6 shrink-0 rounded-full px-2 text-xs"
        >
          #{index + 1}
        </Badge>
        {isOwner ? (
          <Input
            value={slot.description}
            onChange={(e) =>
              onUpdate({ ...slot, description: e.target.value })
            }
            placeholder={t('storyboard.slotDescription')}
            className="min-w-0 flex-1"
          />
        ) : (
          <p className="min-w-0 flex-1 text-sm">
            {slot.description || '-'}
          </p>
        )}
      </div>

      {/* Row 2: Person selector + action buttons */}
      <div className="flex items-center gap-2">
        {isOwner ? (
          <Select
            value={slot.assigned_to}
            onValueChange={(value) =>
              onUpdate({ ...slot, assigned_to: value })
            }
          >
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder={t('storyboard.assignedTo')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={userAId}>{userAName}</SelectItem>
              <SelectItem value={userBId}>{userBName}</SelectItem>
            </SelectContent>
          </Select>
        ) : (
          <Badge variant="outline">
            {assignedName}
          </Badge>
        )}

        <div className="flex-1" />

        {isOwner && (
          <div className="flex items-center gap-0.5">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={onMoveUp}
              disabled={isFirst}
            >
              <ChevronUp className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={onMoveDown}
              disabled={isLast}
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-destructive hover:text-destructive"
              onClick={onDelete}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
