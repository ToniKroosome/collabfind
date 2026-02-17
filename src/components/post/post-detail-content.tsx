'use client'

import { ProfileCard } from '@/components/profile/profile-card'
import { InterestButton } from '@/components/post/interest-button'
import { InterestList } from '@/components/post/interest-list'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { COLLAB_TYPE_COLORS, FOLLOWER_RANGES } from '@/lib/constants'
import { MapPin, Users, Calendar, FileText, ShieldCheck, DollarSign, LogIn } from 'lucide-react'
import { TimeAgo } from '@/components/shared/time-ago'
import type { InterestWithProfile } from '@/types/database'
import { useLanguage, getCollabTypeLabel, getNicheLabel } from '@/lib/i18n'
import Link from 'next/link'

interface PostDetailContentProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  post: any
  isOwner: boolean
  hasExpressedInterest: boolean
  interests: InterestWithProfile[]
  userId: string | null
}

export function PostDetailContent({
  post,
  isOwner,
  hasExpressedInterest,
  interests,
  userId,
}: PostDetailContentProps) {
  const { t } = useLanguage()
  const typeLabel = getCollabTypeLabel(t, post.collab_type)
  const typeColor = COLLAB_TYPE_COLORS[post.collab_type] || COLLAB_TYPE_COLORS.other

  const audienceLabel = FOLLOWER_RANGES.find(
    (r) =>
      r.min === post.preferred_audience_min &&
      r.max === post.preferred_audience_max
  )?.label

  return (
    <div className="space-y-4 py-4">
      {/* Author card */}
      <ProfileCard profile={post.profiles} compact />

      {/* Post content */}
      <div className="space-y-3">
        <div>
          <h1 className="text-xl font-bold">{post.title}</h1>
          <p className="mt-0.5 text-xs text-muted-foreground">
            <TimeAgo date={post.created_at} />
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          <Badge className={`${typeColor} text-xs`} variant="secondary">
            {typeLabel}
          </Badge>
          {post.niche_tags.map((tag: string) => (
            <Badge key={tag} variant="outline" className="capitalize text-xs">
              {getNicheLabel(t, tag)}
            </Badge>
          ))}
        </div>

        {/* Description */}
        <p className="whitespace-pre-wrap text-sm leading-relaxed">
          {post.description}
        </p>

        {/* Collab Details */}
        {(post.timeline || post.deliverables || post.requirements || post.compensation) && (
          <div className="space-y-3 rounded-lg border p-4">
            <h2 className="text-sm font-semibold">{t('postDetail.collabDetails')}</h2>
            {post.timeline && (
              <div className="flex items-start gap-2 text-sm">
                <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <div>
                  <p className="text-xs font-medium text-muted-foreground">{t('common.timeline')}</p>
                  <p>{post.timeline}</p>
                </div>
              </div>
            )}
            {post.deliverables && (
              <div className="flex items-start gap-2 text-sm">
                <FileText className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <div>
                  <p className="text-xs font-medium text-muted-foreground">{t('common.deliverables')}</p>
                  <p className="whitespace-pre-wrap">{post.deliverables}</p>
                </div>
              </div>
            )}
            {post.requirements && (
              <div className="flex items-start gap-2 text-sm">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <div>
                  <p className="text-xs font-medium text-muted-foreground">{t('common.requirements')}</p>
                  <p className="whitespace-pre-wrap">{post.requirements}</p>
                </div>
              </div>
            )}
            {post.compensation && (
              <div className="flex items-start gap-2 text-sm">
                <DollarSign className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <div>
                  <p className="text-xs font-medium text-muted-foreground">{t('common.compensation')}</p>
                  <p>{post.compensation}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Meta info */}
        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
          {audienceLabel && (
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              {t('postDetail.lookingFor').replace('{range}', audienceLabel)}
            </span>
          )}
          {post.location && (
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {post.location}
            </span>
          )}
        </div>
      </div>

      {/* Action section */}
      {!isOwner && post.is_open && userId && (
        <InterestButton
          postId={post.id}
          userId={userId}
          hasExpressedInterest={hasExpressedInterest}
        />
      )}

      {!isOwner && post.is_open && !userId && (
        <Link href="/login">
          <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
            <LogIn className="mr-2 h-4 w-4" />
            {t('auth.loginToInterest')}
          </Button>
        </Link>
      )}

      {!post.is_open && !isOwner && (
        <p className="text-center text-sm text-muted-foreground">
          {t('postDetail.noLongerAccepting')}
        </p>
      )}

      {/* Owner: interest list */}
      {isOwner && <InterestList interests={interests} />}
    </div>
  )
}
