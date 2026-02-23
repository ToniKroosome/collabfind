'use client'

import { useRef, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Undo2, Trash2 } from 'lucide-react'
import { useLanguage } from '@/lib/i18n'
import { simplifyPoints, renderStrokes } from '@/lib/drawing-utils'
import type { DrawingStroke } from '@/types/database'

const MAX_STROKES = 50
const STROKE_COLOR = '#000000'
const STROKE_WIDTH = 2
const SIMPLIFY_EPSILON = 0.005 // In normalized 0-1 space

interface DrawingCanvasProps {
  strokes: DrawingStroke[]
  onStrokesChange: (strokes: DrawingStroke[]) => void
  readOnly: boolean
}

export function DrawingCanvas({ strokes, onStrokesChange, readOnly }: DrawingCanvasProps) {
  const { t } = useLanguage()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const drawingRef = useRef({
    isDrawing: false,
    currentPoints: [] as number[],
    animFrameId: 0,
  })

  // Resize canvas to match container
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const rect = container.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    canvas.style.width = `${rect.width}px`
    canvas.style.height = `${rect.height}px`

    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.scale(dpr, dpr)
      renderStrokes(ctx, strokes, rect.width, rect.height)
    }
  }, [strokes])

  useEffect(() => {
    resizeCanvas()
    const observer = new ResizeObserver(resizeCanvas)
    if (containerRef.current) observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [resizeCanvas])

  // Re-render when strokes change (e.g. after undo)
  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const rect = container.getBoundingClientRect()
    renderStrokes(ctx, strokes, rect.width, rect.height)
  }, [strokes])

  const getPoint = (e: React.PointerEvent): [number, number] | null => {
    const canvas = canvasRef.current
    if (!canvas) return null
    const rect = canvas.getBoundingClientRect()
    return [
      (e.clientX - rect.left) / rect.width,
      (e.clientY - rect.top) / rect.height,
    ]
  }

  const drawCurrentStroke = useCallback(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const rect = container.getBoundingClientRect()
    const pts = drawingRef.current.currentPoints

    // Redraw all saved strokes + current in-progress stroke
    renderStrokes(ctx, strokes, rect.width, rect.height)

    if (pts.length >= 4) {
      ctx.strokeStyle = STROKE_COLOR
      ctx.lineWidth = STROKE_WIDTH
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.beginPath()
      ctx.moveTo(pts[0] * rect.width, pts[1] * rect.height)
      for (let i = 2; i < pts.length; i += 2) {
        ctx.lineTo(pts[i] * rect.width, pts[i + 1] * rect.height)
      }
      ctx.stroke()
    }
  }, [strokes])

  const onPointerDown = (e: React.PointerEvent) => {
    if (readOnly || strokes.length >= MAX_STROKES) return
    e.preventDefault()
    const point = getPoint(e)
    if (!point) return

    drawingRef.current.isDrawing = true
    drawingRef.current.currentPoints = [point[0], point[1]]
    ;(e.target as HTMLCanvasElement).setPointerCapture(e.pointerId)
  }

  const onPointerMove = (e: React.PointerEvent) => {
    if (!drawingRef.current.isDrawing) return
    e.preventDefault()
    const point = getPoint(e)
    if (!point) return

    const pts = drawingRef.current.currentPoints
    // Skip if too close to last point
    const lastX = pts[pts.length - 2]
    const lastY = pts[pts.length - 1]
    const dx = point[0] - lastX
    const dy = point[1] - lastY
    if (dx * dx + dy * dy < 0.0001) return // ~1px at typical canvas size

    pts.push(point[0], point[1])

    // Render via RAF to avoid excessive paint calls
    cancelAnimationFrame(drawingRef.current.animFrameId)
    drawingRef.current.animFrameId = requestAnimationFrame(drawCurrentStroke)
  }

  const onPointerUp = (e: React.PointerEvent) => {
    if (!drawingRef.current.isDrawing) return
    drawingRef.current.isDrawing = false
    ;(e.target as HTMLCanvasElement).releasePointerCapture(e.pointerId)

    const pts = drawingRef.current.currentPoints
    if (pts.length < 4) return // Need at least 2 points

    const simplified = simplifyPoints(pts, SIMPLIFY_EPSILON)
    const newStroke: DrawingStroke = {
      points: simplified,
      color: STROKE_COLOR,
      width: STROKE_WIDTH,
    }
    onStrokesChange([...strokes, newStroke])
    drawingRef.current.currentPoints = []
  }

  const handleUndo = () => {
    if (strokes.length === 0) return
    onStrokesChange(strokes.slice(0, -1))
  }

  const handleClear = () => {
    if (strokes.length === 0) return
    onStrokesChange([])
  }

  return (
    <div className="space-y-1">
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden rounded border border-dashed border-muted-foreground/30 bg-muted/20"
        style={{ aspectRatio: '3 / 2' }}
      >
        <canvas
          ref={canvasRef}
          className={readOnly ? 'pointer-events-none' : 'cursor-crosshair'}
          style={{ touchAction: 'none', display: 'block', width: '100%', height: '100%' }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        />
      </div>
      {!readOnly && (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={handleUndo}
            disabled={strokes.length === 0}
            title={t('storyboard.undoStroke')}
          >
            <Undo2 className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-destructive hover:text-destructive"
            onClick={handleClear}
            disabled={strokes.length === 0}
            title={t('storyboard.clearDrawing')}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
          <span className="ml-auto text-[10px] text-muted-foreground">
            {strokes.length}/{MAX_STROKES}
          </span>
        </div>
      )}
    </div>
  )
}
