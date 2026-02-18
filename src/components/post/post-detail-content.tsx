'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ProfileCard } from '@/components/profile/profile-card'
import { InterestButton } from '@/components/post/interest-button'
import { InterestList } from '@/components/post/interest-list'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { COLLAB_TYPE_COLORS, FOLLOWER_RANGES } from '@/lib/constants'
import { MapPin, Users, Calendar, FileText, ShieldCheck, DollarSign, LogIn, Trash2 } from 'lucide-react'
import { TimeAgo } from '@/components/shared/time-ago'
import { toast } from 'sonner'
import type { InterestWithProfile } from '@/types/database'
import { useLanguage, getCollabTypeLabel, getNicheLabel, getDeliverableTypeLabel } from '@/lib/i18n'
import type { DeliverableSlot } from '@/types/database'
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
  const router = useRouter()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const typeLabel = getCollabTypeLabel(t, post.collab_type)
  const typeColor = COLLAB_TYPE_COLORS[post.collab_type] || COLLAB_TYPE_COLORS.other

  const audienceLabel = FOLLOWER_RANGES.find(
    (r) =>
      r.min === post.preferred_audience_min &&
      r.max === post.preferred_audience_max
  )?.label

  const handleDelete = async () => {
    setDeleting(true)
    const supabase = createClient()
    const { error } = await supabase
      .from('collab_posts')
      .delete()
      .eq('id', post.id)

    if (error) {
      toast.error(t('toast.failedDeletePost' as any))
      setDeleting(false)
      return
    }

    toast.success(t('toast.postDeleted' as any))
    router.push('/feed')
    router.refresh()
  }

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
          {post.max_collaborators > 1 && (
            <Badge variant="secondary" className="text-xs bg-indigo-50 text-indigo-700 border-indigo-200">
              <Users className="mr-1 h-3 w-3" />
              {t('collab.lookingForN').replace('{n}', String(post.max_collaborators))}
            </Badge>
          )}
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
        {(post.timeline || post.deliverables || post.deliverable_slots || post.requirements || post.compensation) && (
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
            {/* Structured deliverable slots */}
            {post.deliverable_slots && Array.isArray(post.deliverable_slots) && post.deliverable_slots.length > 0 ? (
              <div className="flex items-start gap-2 text-sm">
                <FileText className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <div className="space-y-1.5">
                  <p className="text-xs font-medium text-muted-foreground">{t('common.deliverables')}</p>
                  {(post.deliverable_slots as DeliverableSlot[]).map((slot: DeliverableSlot, idx: number) => (
                    <div key={idx} className="flex items-center gap-1.5">
                      <Badge variant="secondary" className="text-xs">
                        {slot.quantity}x {getDeliverableTypeLabel(t, slot.content_type)}
                      </Badge>
                      {slot.description && (
                        <span className="text-muted-foreground">{slot.description}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : post.deliverables ? (
              <div className="flex items-start gap-2 text-sm">
                <FileText className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <div>
                  <p className="text-xs font-medium text-muted-foreground">{t('common.deliverables')}</p>
                  <p className="whitespace-pre-wrap">{post.deliverables}</p>
                </div>
              </div>
            ) : null}
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
      {isOwner && (
        <InterestList
          interests={interests}
          maxCollaborators={post.max_collaborators || 1}
          collabMode={post.collab_mode || 'separate'}
        />
      )}

      {/* Owner: delete post */}
      {isOwner && (
        <>
          <Button
            variant="ghost"
            className="w-full text-destructive hover:text-destructive"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {t('postDetail.deletePost' as any)}
          </Button>

          <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t('postDetail.deleteTitle' as any)}</DialogTitle>
                <DialogDescription>{t('postDetail.deleteDesc' as any)}</DialogDescription>
              </DialogHeader>
              <DialogFooter className="gap-2 sm:gap-0">
                <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                  {t('common.cancel')}
                </Button>
                <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
                  {deleting ? t('postDetail.deleting' as any) : t('postDetail.confirmDelete' as any)}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  )
}
