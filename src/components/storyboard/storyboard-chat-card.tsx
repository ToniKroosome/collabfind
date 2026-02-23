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

  // No storyboard yet — show create button for owner
  if (!storyboard) {
    if (!isOwner) return null
    return (
      <div className="flex justify-start mb-2">
        <button
          onClick={onCreate}
          className="max-w-[75%] rounded-2xl rounded-bl-md bg-muted px-3.5 py-2 text-sm text-left hover:bg-muted/80 transition-colors"
        >
          <span className="flex items-center gap-1.5">
            <Plus className="h-3.5 w-3.5 text-indigo-600" />
            <span className="font-medium">{t('storyboard.createStoryboard')}</span>
          </span>
        </button>
      </div>
    )
  }

  return (
    <div className="flex justify-start mb-2">
      <div className="max-w-[75%]">
        {/* Message bubble */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full rounded-2xl rounded-bl-md bg-muted px-3.5 py-2 text-sm text-left hover:bg-muted/80 transition-colors"
        >
          <span className="flex items-center gap-1.5">
            <Clapperboard className="h-3.5 w-3.5 shrink-0 text-indigo-600" />
            <span className="flex-1 font-medium">
              {t('storyboard.storyboard')}
              {slots.length > 0 && (
                <span className="ml-1 font-normal text-muted-foreground">
                  · {slots.length} {t('storyboard.slots')}
                </span>
              )}
            </span>
            <ChevronDown
              className={`h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform ${
                expanded ? 'rotate-180' : ''
              }`}
            />
          </span>
        </button>

        {/* Expanded storyboard content — slides out below the bubble */}
        {expanded && (
          <div className="mt-1 space-y-1.5 rounded-2xl rounded-tl-md bg-muted px-3.5 py-2.5">
            {slots.length === 0 ? (
              <p className="py-1 text-xs text-muted-foreground">
                {t('storyboard.noStoryboardHint')}
              </p>
            ) : (
              slots.map((slot, i) => (
                <div key={i} className="space-y-1 rounded-lg bg-background/60 p-2">
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
                className="w-full gap-1 text-xs mt-1"
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
    </div>
  )
}
