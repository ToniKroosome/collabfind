'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { MapPin, ExternalLink } from 'lucide-react'
import type { Profile } from '@/types/database'
import { FOLLOWER_RANGES } from '@/lib/constants'
import Link from 'next/link'
import { useLanguage, getNicheLabel } from '@/lib/i18n'

interface ProfileCardProps {
  profile: Profile
  showEditButton?: boolean
  compact?: boolean
}

export function ProfileCard({ profile, showEditButton, compact }: ProfileCardProps) {
  const { t } = useLanguage()

  const followerLabel = FOLLOWER_RANGES.find(
    (r) =>
      r.min === profile.follower_count_min &&
      r.max === profile.follower_count_max
  )?.label

  const socialLinks = [
    { url: profile.instagram_url, label: t('profile.instagram').replace(' URL', '') },
    { url: profile.tiktok_url, label: t('profile.tiktok').replace(' URL', '') },
    { url: profile.youtube_url, label: t('profile.youtube').replace(' URL', '') },
    { url: profile.twitter_url, label: t('profile.twitterX').replace(' URL', '') },
  ].filter((l) => l.url)

  return (
    <Card>
      <CardContent className={compact ? 'p-3' : 'p-4'}>
        <div className="flex items-start gap-3">
          <Link href={`/profile/${profile.id}`}>
            <Avatar className={compact ? 'h-10 w-10' : 'h-16 w-16'}>
              <AvatarImage src={profile.avatar_url || undefined} />
              <AvatarFallback className={compact ? 'text-sm' : 'text-xl'}>
                {profile.full_name?.charAt(0) || '?'}
              </AvatarFallback>
            </Avatar>
          </Link>
          <div className="min-w-0 flex-1">
            <Link href={`/profile/${profile.id}`}>
              <h3 className="font-semibold hover:underline">
                {profile.full_name || t('common.unknown')}
              </h3>
            </Link>
            {profile.username && (
              <p className="text-sm text-muted-foreground">
                @{profile.username}
              </p>
            )}
            {!compact && profile.bio && (
              <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                {profile.bio}
              </p>
            )}
          </div>
          {showEditButton && (
            <Link href="/profile">
              <Button variant="outline" size="sm">
                {t('profile.edit')}
              </Button>
            </Link>
          )}
        </div>

        {!compact && (
          <>
            {/* Niche badges */}
            {profile.niche.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {profile.niche.map((n) => (
                  <Badge key={n} variant="secondary" className="capitalize text-xs">
                    {getNicheLabel(t, n)}
                  </Badge>
                ))}
              </div>
            )}

            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              {followerLabel && (
                <span className="font-medium">{followerLabel} {t('profile.followers')}</span>
              )}
              {profile.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {profile.location}
                </span>
              )}
            </div>

            {/* Social links */}
            {socialLinks.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {socialLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.url!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:underline"
                  >
                    {link.label}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                ))}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
