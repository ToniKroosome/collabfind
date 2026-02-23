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
import { DrawingCanvas } from '@/components/storyboard/drawing-canvas'
import type { StoryboardSlot as StoryboardSlotType, CollabMember } from '@/types/database'

const MEMBER_COLORS = [
  '#dcfce7', // green
  '#dbeafe', // blue
  '#fce7f3', // pink
  '#fef3c7', // amber
  '#e0e7ff', // indigo
  '#ecfeff', // cyan
  '#faf5ff', // purple
  '#fff7ed', // orange
  '#f0fdf4', // emerald
  '#fefce8', // yellow
]
const UNASSIGNED_BG = '#e4e4e7' // zinc-200

interface StoryboardSlotProps {
  slot: StoryboardSlotType
  index: number
  isOwner: boolean
  members: CollabMember[]
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
  members,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}: StoryboardSlotProps) {
  const { t } = useLanguage()

  const member = members.find((m) => m.id === slot.assigned_to)
  const assignedName = member?.full_name || '?'
  const memberIndex = members.findIndex((m) => m.id === slot.assigned_to)
  const slotBg = memberIndex >= 0 ? MEMBER_COLORS[memberIndex % MEMBER_COLORS.length] : UNASSIGNED_BG
  return (
    <div className="space-y-2 rounded-lg border p-3" style={{ backgroundColor: slotBg }}>
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

      {/* Row 2: Drawing canvas */}
      {(isOwner || (slot.drawing && slot.drawing.length > 0)) && (
        <DrawingCanvas
          strokes={slot.drawing || []}
          onStrokesChange={(drawing) => onUpdate({ ...slot, drawing })}
          readOnly={!isOwner}
        />
      )}

      {/* Row 3: Person selector + action buttons */}
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
              {members.map((m) => (
                <SelectItem key={m.id} value={m.id}>
                  {m.full_name || '?'}
                </SelectItem>
              ))}
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
