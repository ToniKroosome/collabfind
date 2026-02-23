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
  { bg: 'bg-indigo-50 dark:bg-indigo-950/30', border: 'border-indigo-300 dark:border-indigo-700' },
  { bg: 'bg-emerald-50 dark:bg-emerald-950/30', border: 'border-emerald-300 dark:border-emerald-700' },
  { bg: 'bg-amber-50 dark:bg-amber-950/30', border: 'border-amber-300 dark:border-amber-700' },
  { bg: 'bg-rose-50 dark:bg-rose-950/30', border: 'border-rose-300 dark:border-rose-700' },
  { bg: 'bg-cyan-50 dark:bg-cyan-950/30', border: 'border-cyan-300 dark:border-cyan-700' },
  { bg: 'bg-violet-50 dark:bg-violet-950/30', border: 'border-violet-300 dark:border-violet-700' },
]

const FALLBACK_COLOR = { bg: '', border: 'border' }

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
  const color = memberIndex === -1 ? FALLBACK_COLOR : MEMBER_COLORS[memberIndex % MEMBER_COLORS.length]

  return (
    <div className={`space-y-2 rounded-lg border p-3 ${color.bg} ${color.border}`}>
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
