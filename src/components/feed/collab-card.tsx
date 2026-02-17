'use client'

import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { MapPin, Star } from 'lucide-react'
import { COLLAB_TYPE_COLORS, COLLAB_TYPES } from '@/lib/constants'
import { timeAgo } from '@/components/shared/time-ago'
import type { CollabPostWithProfile } from '@/types/database'

interface CollabCardProps {
  post: CollabPostWithProfile
  reputation?: { avgRating: number; count: number }
}

export function CollabCard({ post, reputation }: CollabCardProps) {
  const typeLabel =
    COLLAB_TYPES.find((t) => t.value === post.collab_type)?.label ||
    post.collab_type
  const typeColor = COLLAB_TYPE_COLORS[post.collab_type] || COLLAB_TYPE_COLORS.other

  return (
    <Link href={`/post/${post.id}`}>
      <Card className="transition-colors hover:bg-muted/50">
        <CardContent className="p-4">
          {/* Author row */}
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={post.profiles?.avatar_url || undefined} />
              <AvatarFallback className="text-xs">
                {post.profiles?.full_name?.charAt(0) || '?'}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1">
                <p className="truncate text-sm font-medium">
                  {post.profiles?.full_name || 'Unknown'}
                </p>
                {reputation && reputation.count > 0 && (
                  <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    {reputation.avgRating.toFixed(1)}
                  </span>
                )}
              </div>
            </div>
            <span className="text-xs text-muted-foreground">
              {timeAgo(post.created_at)}
            </span>
          </div>

          {/* Title */}
          <h3 className="mt-2 font-semibold leading-tight">{post.title}</h3>

          {/* Description */}
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
            {post.description}
          </p>

          {/* Tags row */}
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            <Badge className={`${typeColor} text-xs`} variant="secondary">
              {typeLabel}
            </Badge>
            {post.niche_tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="capitalize text-xs">
                {tag}
              </Badge>
            ))}
            {post.niche_tags.length > 3 && (
              <span className="text-xs text-muted-foreground">
                +{post.niche_tags.length - 3}
              </span>
            )}
          </div>

          {/* Compensation hint */}
          {post.compensation && (
            <p className="mt-1.5 text-xs font-medium text-emerald-600">
              {post.compensation}
            </p>
          )}

          {/* Timeline hint */}
          {post.timeline && (
            <p className="mt-0.5 text-xs text-muted-foreground">
              Timeline: {post.timeline}
            </p>
          )}

          {/* Location */}
          {post.location && (
            <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              {post.location}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
