import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ProfileCard } from '@/components/profile/profile-card'
import { InterestButton } from '@/components/post/interest-button'
import { InterestList } from '@/components/post/interest-list'
import { Badge } from '@/components/ui/badge'
import { COLLAB_TYPES, COLLAB_TYPE_COLORS, FOLLOWER_RANGES } from '@/lib/constants'
import { MapPin, Users, Calendar, FileText, ShieldCheck, DollarSign } from 'lucide-react'
import { timeAgo } from '@/components/shared/time-ago'
import type { InterestWithProfile } from '@/types/database'

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: post } = await supabase
    .from('collab_posts')
    .select('*, profiles:user_id(*)')
    .eq('id', id)
    .single()

  if (!post) notFound()

  const isOwner = user.id === post.user_id
  const typeLabel =
    COLLAB_TYPES.find((t) => t.value === post.collab_type)?.label ||
    post.collab_type
  const typeColor = COLLAB_TYPE_COLORS[post.collab_type] || COLLAB_TYPE_COLORS.other

  const audienceLabel = FOLLOWER_RANGES.find(
    (r) =>
      r.min === post.preferred_audience_min &&
      r.max === post.preferred_audience_max
  )?.label

  // Check if current user already expressed interest
  let hasExpressedInterest = false
  if (!isOwner) {
    const { data: existingInterest } = await supabase
      .from('interests')
      .select('id')
      .eq('post_id', id)
      .eq('user_id', user.id)
      .maybeSingle()
    hasExpressedInterest = !!existingInterest
  }

  // If owner, fetch interests
  let interests: InterestWithProfile[] = []
  if (isOwner) {
    const { data } = await supabase
      .from('interests')
      .select('*, profiles:user_id(*)')
      .eq('post_id', id)
      .order('created_at', { ascending: false })
    interests = (data as InterestWithProfile[]) || []
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
            {timeAgo(post.created_at)}
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          <Badge className={`${typeColor} text-xs`} variant="secondary">
            {typeLabel}
          </Badge>
          {post.niche_tags.map((tag: string) => (
            <Badge key={tag} variant="outline" className="capitalize text-xs">
              {tag}
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
            <h2 className="text-sm font-semibold">Collab Details</h2>
            {post.timeline && (
              <div className="flex items-start gap-2 text-sm">
                <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Timeline</p>
                  <p>{post.timeline}</p>
                </div>
              </div>
            )}
            {post.deliverables && (
              <div className="flex items-start gap-2 text-sm">
                <FileText className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Deliverables</p>
                  <p className="whitespace-pre-wrap">{post.deliverables}</p>
                </div>
              </div>
            )}
            {post.requirements && (
              <div className="flex items-start gap-2 text-sm">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Requirements</p>
                  <p className="whitespace-pre-wrap">{post.requirements}</p>
                </div>
              </div>
            )}
            {post.compensation && (
              <div className="flex items-start gap-2 text-sm">
                <DollarSign className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Compensation</p>
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
              Looking for {audienceLabel} followers
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
      {!isOwner && post.is_open && (
        <InterestButton
          postId={post.id}
          userId={user.id}
          hasExpressedInterest={hasExpressedInterest}
        />
      )}

      {!post.is_open && !isOwner && (
        <p className="text-center text-sm text-muted-foreground">
          This collab post is no longer accepting interests.
        </p>
      )}

      {/* Owner: interest list */}
      {isOwner && <InterestList interests={interests} />}
    </div>
  )
}
