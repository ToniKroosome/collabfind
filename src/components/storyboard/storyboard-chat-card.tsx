'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Clapperboard, ChevronDown, Pencil, Plus } from 'lucide-react'
import { useLanguage } from '@/lib/i18n'
import { renderStrokes } from '@/lib/drawing-utils'
import type { Storyboard, StoryboardSlot, CollabMember, DrawingStroke } from '@/types/database'

const MEMBER_COLORS = [
  { bg: 'bg-indigo-100 dark:bg-indigo-950/50', border: 'border-indigo-300 dark:border-indigo-700', name: 'text-indigo-700 dark:text-indigo-300' },
  { bg: 'bg-emerald-100 dark:bg-emerald-950/50', border: 'border-emerald-300 dark:border-emerald-700', name: 'text-emerald-700 dark:text-emerald-300' },
  { bg: 'bg-amber-100 dark:bg-amber-950/50', border: 'border-amber-300 dark:border-amber-700', name: 'text-amber-700 dark:text-amber-300' },
  { bg: 'bg-rose-100 dark:bg-rose-950/50', border: 'border-rose-300 dark:border-rose-700', name: 'text-rose-700 dark:text-rose-300' },
  { bg: 'bg-cyan-100 dark:bg-cyan-950/50', border: 'border-cyan-300 dark:border-cyan-700', name: 'text-cyan-700 dark:text-cyan-300' },
  { bg: 'bg-violet-100 dark:bg-violet-950/50', border: 'border-violet-300 dark:border-violet-700', name: 'text-violet-700 dark:text-violet-300' },
]

const FALLBACK_COLOR = { bg: 'bg-gray-100 dark:bg-gray-800', border: 'border-gray-300 dark:border-gray-600', name: 'text-muted-foreground' }

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

  const getMemberColor = (id: string) => {
    const index = members.findIndex((m) => m.id === id)
    if (index === -1) return FALLBACK_COLOR
    return MEMBER_COLORS[index % MEMBER_COLORS.length]
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
          className="w-full rounded-2xl rounded-bl-md bg-indigo-50 dark:bg-indigo-950/40 px-3.5 py-2 text-sm text-left hover:bg-indigo-100 dark:hover:bg-indigo-950/60 transition-colors border border-indigo-200 dark:border-indigo-800"
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
          <div className="mt-1 space-y-1.5 rounded-2xl rounded-tl-md bg-background border border-border px-3.5 py-2.5">
            {slots.length === 0 ? (
              <p className="py-1 text-xs text-muted-foreground">
                {t('storyboard.noStoryboardHint')}
              </p>
            ) : (
              slots.map((slot, i) => {
                const color = getMemberColor(slot.assigned_to)
                return (
                <div key={i} className={`space-y-1 rounded-lg border ${color.bg} ${color.border} p-2`}>
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
                      <p className={`text-[10px] font-medium ${color.name}`}>
                        {getMemberName(slot.assigned_to)}
                      </p>
                    </div>
                  </div>
                  {slot.drawing && slot.drawing.length > 0 && (
                    <DrawingThumbnail strokes={slot.drawing} />
                  )}
                </div>
                )
              })
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
