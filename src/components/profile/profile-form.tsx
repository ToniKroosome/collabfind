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
import { Camera } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ProfileFormProps {
  profile: Profile
  isOnboarding?: boolean
}

export function ProfileForm({ profile, isOnboarding }: ProfileFormProps) {
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
    return range?.label || ''
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.full_name.trim()) {
      toast.error('Please enter your name')
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
        toast.error('Username is already taken')
      } else {
        toast.error('Failed to save profile')
      }
      setSaving(false)
      return
    }

    toast.success('Profile saved!')
    router.push('/feed')
    router.refresh()
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {isOnboarding && (
        <div className="text-center">
          <h1 className="text-2xl font-bold">Complete your profile</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Help others find and connect with you
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
        <Label htmlFor="full_name">Full Name *</Label>
        <Input
          id="full_name"
          value={formData.full_name}
          onChange={(e) =>
            setFormData((p) => ({ ...p, full_name: e.target.value }))
          }
          placeholder="Your full name"
          required
        />
      </div>

      {/* Username */}
      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          value={formData.username}
          onChange={(e) =>
            setFormData((p) => ({ ...p, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '') }))
          }
          placeholder="your_username"
        />
      </div>

      {/* Bio */}
      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          value={formData.bio}
          onChange={(e) =>
            setFormData((p) => ({ ...p, bio: e.target.value }))
          }
          placeholder="Tell others about yourself and what kind of collabs you're looking for..."
          maxLength={300}
          rows={3}
        />
        <p className="text-xs text-muted-foreground">
          {formData.bio.length}/300
        </p>
      </div>

      {/* Niche */}
      <div className="space-y-2">
        <Label>Your Niche(s)</Label>
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
              {niche}
            </Badge>
          ))}
        </div>
      </div>

      {/* Follower Range */}
      <div className="space-y-2">
        <Label>Follower Count Range</Label>
        <Select value={getCurrentRange()} onValueChange={handleFollowerRange}>
          <SelectTrigger>
            <SelectValue placeholder="Select your audience size" />
          </SelectTrigger>
          <SelectContent>
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
        <Label>Social Links</Label>
        <Input
          placeholder="Instagram URL"
          value={formData.instagram_url}
          onChange={(e) =>
            setFormData((p) => ({ ...p, instagram_url: e.target.value }))
          }
        />
        <Input
          placeholder="TikTok URL"
          value={formData.tiktok_url}
          onChange={(e) =>
            setFormData((p) => ({ ...p, tiktok_url: e.target.value }))
          }
        />
        <Input
          placeholder="YouTube URL"
          value={formData.youtube_url}
          onChange={(e) =>
            setFormData((p) => ({ ...p, youtube_url: e.target.value }))
          }
        />
        <Input
          placeholder="Twitter/X URL"
          value={formData.twitter_url}
          onChange={(e) =>
            setFormData((p) => ({ ...p, twitter_url: e.target.value }))
          }
        />
      </div>

      {/* Location */}
      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          value={formData.location}
          onChange={(e) =>
            setFormData((p) => ({ ...p, location: e.target.value }))
          }
          placeholder="City, Country"
        />
      </div>

      <Button type="submit" className="w-full" disabled={saving}>
        {saving ? 'Saving...' : isOnboarding ? 'Complete Profile' : 'Save Changes'}
      </Button>
    </form>
  )
}
