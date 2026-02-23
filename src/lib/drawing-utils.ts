import type { DrawingStroke } from '@/types/database'

// Ramer-Douglas-Peucker line simplification
// points is flat [x1,y1,x2,y2,...], epsilon in normalized 0-1 space
export function simplifyPoints(points: number[], epsilon: number): number[] {
  const n = points.length / 2
  if (n <= 2) return points

  // Find the point with the maximum distance from the line start→end
  let maxDist = 0
  let maxIdx = 0
  const sx = points[0], sy = points[1]
  const ex = points[(n - 1) * 2], ey = points[(n - 1) * 2 + 1]

  for (let i = 1; i < n - 1; i++) {
    const px = points[i * 2], py = points[i * 2 + 1]
    const dist = perpendicularDistance(px, py, sx, sy, ex, ey)
    if (dist > maxDist) {
      maxDist = dist
      maxIdx = i
    }
  }

  if (maxDist > epsilon) {
    const left = simplifyPoints(points.slice(0, (maxIdx + 1) * 2), epsilon)
    const right = simplifyPoints(points.slice(maxIdx * 2), epsilon)
    // Remove duplicate point at the join
    return [...left.slice(0, -2), ...right]
  }

  // All points between start and end are within epsilon — keep only endpoints
  return [sx, sy, ex, ey]
}

function perpendicularDistance(
  px: number, py: number,
  sx: number, sy: number,
  ex: number, ey: number
): number {
  const dx = ex - sx
  const dy = ey - sy
  const lenSq = dx * dx + dy * dy
  if (lenSq === 0) return Math.hypot(px - sx, py - sy)
  const t = Math.max(0, Math.min(1, ((px - sx) * dx + (py - sy) * dy) / lenSq))
  return Math.hypot(px - (sx + t * dx), py - (sy + t * dy))
}

// Render strokes to a canvas context
export function renderStrokes(
  ctx: CanvasRenderingContext2D,
  strokes: DrawingStroke[],
  width: number,
  height: number
) {
  ctx.clearRect(0, 0, width, height)
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'

  for (const stroke of strokes) {
    if (stroke.points.length < 4) continue
    ctx.strokeStyle = stroke.color
    ctx.lineWidth = stroke.width
    ctx.beginPath()
    ctx.moveTo(stroke.points[0] * width, stroke.points[1] * height)
    for (let i = 2; i < stroke.points.length; i += 2) {
      ctx.lineTo(stroke.points[i] * width, stroke.points[i + 1] * height)
    }
    ctx.stroke()
  }
}
