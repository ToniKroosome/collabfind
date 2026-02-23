'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Clapperboard, ChevronDown, Pencil, Plus } from 'lucide-react'
import { useLanguage } from '@/lib/i18n'
import { renderStrokes } from '@/lib/drawing-utils'
import type { Storyboard, StoryboardSlot, CollabMember, DrawingStroke } from '@/types/database'

interface StoryboardChatCardProps {
  storyboard: Storyboard | null
  members: CollabMember[]
  isOwner: boolean
  onEdit: () => void
  onCreate: () => void
}

function DrawingThumbnail({ strokes }: { strokes: DrawingStroke[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const dpr = window.devicePixelRatio || 1
    canvas.width = 120 * dpr
    canvas.height = 80 * dpr
    ctx.scale(dpr, dpr)
    renderStrokes(ctx, strokes, 120, 80)
  }, [strokes])

  return (
    <canvas
      ref={canvasRef}
      className="rounded border border-muted"
      style={{ width: 120, height: 80 }}
    />
  )
}

export function StoryboardChatCard({
  storyboard,
  members,
  isOwner,
  onEdit,
  onCreate,
}: StoryboardChatCardProps) {
  const { t } = useLanguage()
  const [expanded, setExpanded] = useState(false)

  const slots: StoryboardSlot[] = storyboard
    ? ((storyboard.slots as StoryboardSlot[] | null) || [])
    : []

  const getMemberName = (id: string) => {
    const m = members.find((m) => m.id === id)
    return m?.full_name?.split(' ')[0] || '?'
  }

  // No storyboard yet
  if (!storyboard) {
    if (!isOwner) return null
    return (
      <div className="mx-auto mb-2 w-fit">
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 text-xs"
          onClick={onCreate}
        >
          <Plus className="h-3 w-3" />
          {t('storyboard.createStoryboard')}
        </Button>
      </div>
    )
  }

  return (
    <div className="mx-auto mb-2 w-full max-w-[320px]">
      {/* Collapsed header — always visible */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center gap-2 rounded-lg border bg-muted/50 px-3 py-2 text-left transition-colors hover:bg-muted"
      >
        <Clapperboard className="h-4 w-4 shrink-0 text-indigo-600" />
        <span className="flex-1 text-xs font-medium">
          {t('storyboard.storyboard')}
          {slots.length > 0 && (
            <span className="ml-1 text-muted-foreground">
              · {slots.length} {t('storyboard.slots')}
            </span>
          )}
        </span>
        <ChevronDown
          className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${
            expanded ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="mt-1 space-y-1.5 rounded-lg border bg-background p-2">
          {slots.length === 0 ? (
            <p className="py-2 text-center text-xs text-muted-foreground">
              {t('storyboard.noStoryboardHint')}
            </p>
          ) : (
            slots.map((slot, i) => (
              <div key={i} className="space-y-1 rounded-md bg-muted/30 p-2">
                <div className="flex items-start gap-1.5">
                  <Badge
                    variant="secondary"
                    className="mt-0.5 h-5 shrink-0 rounded-full px-1.5 text-[10px]"
                  >
                    #{i + 1}
                  </Badge>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs leading-snug">
                      {slot.description || '-'}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {getMemberName(slot.assigned_to)}
                    </p>
                  </div>
                </div>
                {slot.drawing && slot.drawing.length > 0 && (
                  <DrawingThumbnail strokes={slot.drawing} />
                )}
              </div>
            ))
          )}

          {isOwner && (
            <Button
              variant="outline"
              size="sm"
              className="w-full gap-1 text-xs"
              onClick={(e) => {
                e.stopPropagation()
                onEdit()
              }}
            >
              <Pencil className="h-3 w-3" />
              {t('storyboard.edit')}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
