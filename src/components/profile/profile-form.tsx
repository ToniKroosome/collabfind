'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { NICHES, FOLLOWER_RANGES } from '@/lib/constants'
import type { Profile } from '@/types/database'
import { toast } from 'sonner'
import { Camera, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useLanguage, getNicheLabel } from '@/lib/i18n'
import { SocialVerifyDialog } from '@/components/profile/social-verify-dialog'

interface ProfileFormProps {
  profile: Profile
  isOnboarding?: boolean
}

export function ProfileForm({ profile, isOnboarding }: ProfileFormProps) {
  const { t } = useLanguage()
  const [formData, setFormData] = useState({
    username: profile.username || '',
    full_name: profile.full_name || '',
    bio: profile.bio || '',
    niche: profile.niche || [],
    follower_count_min: profile.follower_count_min || 0,
    follower_count_max: profile.follower_count_max || 0,
    instagram_url: profile.instagram_url || '',
    tiktok_url: profile.tiktok_url || '',
    youtube_url: profile.youtube_url || '',
    twitter_url: profile.twitter_url || '',
    facebook_url: profile.facebook_url || '',
    location: profile.location || '',
  })
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url || '')
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const fileExt = file.name.split('.').pop()
    const filePath = `${profile.id}/avatar.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true })

    if (uploadError) {
      toast.error('Failed to upload avatar')
      setUploading(false)
      return
    }

    const { data } = supabase.storage.from('avatars').getPublicUrl(filePath)
    setAvatarUrl(data.publicUrl)
    setUploading(false)
  }

  const toggleNiche = (niche: string) => {
    setFormData((prev) => ({
      ...prev,
      niche: prev.niche.includes(niche)
        ? prev.niche.filter((n) => n !== niche)
        : [...prev.niche, niche],
    }))
  }

  const handleFollowerRange = (value: string) => {
    if (value === '__any__') {
      setFormData((prev) => ({
        ...prev,
        follower_count_min: 0,
        follower_count_max: 0,
      }))
      return
    }
    const range = FOLLOWER_RANGES.find((r) => r.label === value)
    if (range) {
      setFormData((prev) => ({
        ...prev,
        follower_count_min: range.min,
        follower_count_max: range.max,
      }))
    }
  }

  const getCurrentRange = () => {
    const range = FOLLOWER_RANGES.find(
      (r) =>
        r.min === formData.follower_count_min &&
        r.max === formData.follower_count_max
    )
    return range?.label || '__any__'
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.full_name.trim()) {
      toast.error(t('toast.enterName'))
      return
    }

    setSaving(true)

    const { error } = await supabase
      .from('profiles')
      .update({
        ...formData,
        avatar_url: avatarUrl || null,
        is_profile_complete: true,
      })
      .eq('id', profile.id)

    if (error) {
      if (error.code === '23505') {
        toast.error(t('toast.usernameTaken'))
      } else {
        toast.error(t('toast.failedSaveProfile'))
      }
      setSaving(false)
      return
    }

    toast.success(t('toast.profileSaved'))
    router.push('/feed')
    router.refresh()
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {isOnboarding && (
        <div className="text-center">
          <h1 className="text-2xl font-bold">{t('profile.completeProfile')}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {t('profile.completeProfileHint')}
          </p>
        </div>
      )}

      {/* Avatar */}
      <div className="flex justify-center">
        <label className="relative cursor-pointer">
          <Avatar className="h-24 w-24">
            <AvatarImage src={avatarUrl} />
            <AvatarFallback className="text-2xl">
              {formData.full_name?.charAt(0) || '?'}
            </AvatarFallback>
          </Avatar>
          <div className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-white shadow">
            <Camera className="h-4 w-4" />
          </div>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarUpload}
            disabled={uploading}
          />
        </label>
      </div>

      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="full_name">{t('profile.fullName')}</Label>
        <Input
          id="full_name"
          value={formData.full_name}
          onChange={(e) =>
            setFormData((p) => ({ ...p, full_name: e.target.value }))
          }
          placeholder={t('profile.fullNamePlaceholder')}
          required
        />
      </div>

      {/* Username */}
      <div className="space-y-2">
        <Label htmlFor="username">{t('profile.username')}</Label>
        <Input
          id="username"
          value={formData.username}
          onChange={(e) =>
            setFormData((p) => ({ ...p, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '') }))
          }
          placeholder={t('profile.usernamePlaceholder')}
        />
      </div>

      {/* Bio */}
      <div className="space-y-2">
        <Label htmlFor="bio">{t('profile.bio')}</Label>
        <Textarea
          id="bio"
          value={formData.bio}
          onChange={(e) =>
            setFormData((p) => ({ ...p, bio: e.target.value }))
          }
          placeholder={t('profile.bioPlaceholder')}
          maxLength={300}
          rows={3}
        />
        <p className="text-xs text-muted-foreground">
          {formData.bio.length}/300
        </p>
      </div>

      {/* Niche */}
      <div className="space-y-2">
        <Label>{t('profile.yourNiches')}</Label>
        <div className="flex flex-wrap gap-2">
          {NICHES.map((niche) => (
            <Badge
              key={niche}
              variant={formData.niche.includes(niche) ? 'default' : 'outline'}
              className={cn(
                'cursor-pointer capitalize transition-colors',
                formData.niche.includes(niche) && 'bg-indigo-600 hover:bg-indigo-700'
              )}
              onClick={() => toggleNiche(niche)}
            >
              {getNicheLabel(t, niche)}
            </Badge>
          ))}
        </div>
      </div>

      {/* Follower Range */}
      <div className="space-y-2">
        <Label>{t('profile.followerRange')}</Label>
        <Select value={getCurrentRange()} onValueChange={handleFollowerRange}>
          <SelectTrigger>
            <SelectValue placeholder={t('profile.followerPlaceholder')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__any__">{t('profile.followerAny')}</SelectItem>
            {FOLLOWER_RANGES.map((range) => (
              <SelectItem key={range.label} value={range.label}>
                {range.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Social Links */}
      <div className="space-y-3">
        <Label>{t('profile.socialLinks')}</Label>
        <div className="flex items-center gap-2">
          <Input
            className="flex-1"
            placeholder={t('profile.instagram')}
            value={formData.instagram_url}
            onChange={(e) =>
              setFormData((p) => ({ ...p, instagram_url: e.target.value }))
            }
          />
          <SocialVerifyDialog
            platform="instagram"
            platformLabel="Instagram"
            isVerified={profile.instagram_verified}
            hasUrl={!!formData.instagram_url}
          />
        </div>
        <div className="flex items-center gap-2">
          <Input
            className="flex-1"
            placeholder={t('profile.tiktok')}
            value={formData.tiktok_url}
            onChange={(e) =>
              setFormData((p) => ({ ...p, tiktok_url: e.target.value }))
            }
          />
          <SocialVerifyDialog
            platform="tiktok"
            platformLabel="TikTok"
            isVerified={profile.tiktok_verified}
            hasUrl={!!formData.tiktok_url}
          />
        </div>
        <div className="flex items-center gap-2">
          <Input
            className="flex-1"
            placeholder={t('profile.youtube')}
            value={formData.youtube_url}
            onChange={(e) =>
              setFormData((p) => ({ ...p, youtube_url: e.target.value }))
            }
          />
          <SocialVerifyDialog
            platform="youtube"
            platformLabel="YouTube"
            isVerified={profile.youtube_verified}
            hasUrl={!!formData.youtube_url}
          />
        </div>
        <div className="flex items-center gap-2">
          <Input
            className="flex-1"
            placeholder={t('profile.twitterX')}
            value={formData.twitter_url}
            onChange={(e) =>
              setFormData((p) => ({ ...p, twitter_url: e.target.value }))
            }
          />
          <SocialVerifyDialog
            platform="twitter"
            platformLabel="Twitter/X"
            isVerified={profile.twitter_verified}
            hasUrl={!!formData.twitter_url}
          />
        </div>
        <div className="flex items-center gap-2">
          <Input
            className="flex-1"
            placeholder={t('profile.facebook')}
            value={formData.facebook_url}
            onChange={(e) =>
              setFormData((p) => ({ ...p, facebook_url: e.target.value }))
            }
          />
          <SocialVerifyDialog
            platform="facebook"
            platformLabel="Facebook"
            isVerified={profile.facebook_verified}
            hasUrl={!!formData.facebook_url}
          />
        </div>
      </div>

      {/* Location */}
      <div className="space-y-2">
        <Label htmlFor="location">{t('profile.locationLabel')}</Label>
        <Input
          id="location"
          value={formData.location}
          onChange={(e) =>
            setFormData((p) => ({ ...p, location: e.target.value }))
          }
          placeholder={t('profile.locationPlaceholder')}
        />
      </div>

      <Button type="submit" className="w-full" disabled={saving}>
        {saving ? t('profile.saving') : isOnboarding ? t('profile.completeProfileBtn') : t('profile.saveChanges')}
      </Button>

      {isOnboarding && (
        <div className="text-center pt-2">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-red-500 transition-colors"
            onClick={async () => {
              const supabase = (await import('@/lib/supabase/client')).createClient()
              await supabase.auth.signOut()
              window.location.href = '/login'
            }}
          >
            <LogOut className="h-3.5 w-3.5" />
            {t('profile.signOut')}
          </button>
        </div>
      )}
    </form>
  )
}
