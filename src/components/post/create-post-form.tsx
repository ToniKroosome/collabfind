'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { NICHES, COLLAB_TYPES, FOLLOWER_RANGES } from '@/lib/constants'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { useLanguage, getCollabTypeLabel, getNicheLabel } from '@/lib/i18n'

interface CreatePostFormProps {
  userId: string
}

export function CreatePostForm({ userId }: CreatePostFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [collabType, setCollabType] = useState('')
  const [nicheTags, setNicheTags] = useState<string[]>([])
  const [audienceMin, setAudienceMin] = useState(0)
  const [audienceMax, setAudienceMax] = useState(0)
  const [location, setLocation] = useState('')
  const [showDetails, setShowDetails] = useState(false)
  const [timeline, setTimeline] = useState('')
  const [deliverables, setDeliverables] = useState('')
  const [requirements, setRequirements] = useState('')
  const [compensation, setCompensation] = useState('')
  const [saving, setSaving] = useState(false)
  const router = useRouter()
  const supabase = createClient()
  const { t } = useLanguage()

  const toggleNiche = (niche: string) => {
    setNicheTags((prev) =>
      prev.includes(niche) ? prev.filter((n) => n !== niche) : [...prev, niche]
    )
  }

  const handleAudienceRange = (value: string) => {
    const range = FOLLOWER_RANGES.find((r) => r.label === value)
    if (range) {
      setAudienceMin(range.min)
      setAudienceMax(range.max)
    }
  }

  const getCurrentRange = () => {
    const range = FOLLOWER_RANGES.find(
      (r) => r.min === audienceMin && r.max === audienceMax
    )
    return range?.label || ''
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      toast.error(t('toast.enterTitle'))
      return
    }
    if (!description.trim()) {
      toast.error(t('toast.enterDescription'))
      return
    }
    if (!collabType) {
      toast.error(t('toast.selectCollabType'))
      return
    }

    setSaving(true)

    const { error } = await supabase.from('collab_posts').insert({
      user_id: userId,
      title: title.trim(),
      description: description.trim(),
      collab_type: collabType,
      niche_tags: nicheTags,
      preferred_audience_min: audienceMin,
      preferred_audience_max: audienceMax,
      location: location.trim() || null,
      timeline: timeline.trim() || null,
      deliverables: deliverables.trim() || null,
      requirements: requirements.trim() || null,
      compensation: compensation.trim() || null,
    })

    if (error) {
      toast.error(t('toast.failedCreatePost'))
      setSaving(false)
      return
    }

    toast.success(t('toast.postCreated'))
    router.push('/feed')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 py-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold">{t('createPost.title')}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {t('createPost.subtitle')}
        </p>
      </div>

      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">{t('createPost.titleLabel')}</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={t('createPost.titlePlaceholder')}
          required
          maxLength={100}
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">{t('createPost.descriptionLabel')}</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={t('createPost.descriptionPlaceholder')}
          required
          maxLength={1000}
          rows={5}
        />
        <p className="text-xs text-muted-foreground">
          {description.length}/1000
        </p>
      </div>

      {/* Collab Type */}
      <div className="space-y-2">
        <Label>{t('createPost.collabTypeLabel')}</Label>
        <Select value={collabType} onValueChange={setCollabType}>
          <SelectTrigger>
            <SelectValue placeholder={t('createPost.collabTypePlaceholder')} />
          </SelectTrigger>
          <SelectContent>
            {COLLAB_TYPES.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {getCollabTypeLabel(t, type.value)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Niche Tags */}
      <div className="space-y-2">
        <Label>{t('createPost.nicheTags')}</Label>
        <div className="flex flex-wrap gap-2">
          {NICHES.map((niche) => (
            <Badge
              key={niche}
              variant={nicheTags.includes(niche) ? 'default' : 'outline'}
              className={cn(
                'cursor-pointer capitalize transition-colors',
                nicheTags.includes(niche) && 'bg-indigo-600 hover:bg-indigo-700'
              )}
              onClick={() => toggleNiche(niche)}
            >
              {getNicheLabel(t, niche)}
            </Badge>
          ))}
        </div>
      </div>

      {/* Preferred Audience Size */}
      <div className="space-y-2">
        <Label>{t('createPost.audienceSize')}</Label>
        <Select value={getCurrentRange()} onValueChange={handleAudienceRange}>
          <SelectTrigger>
            <SelectValue placeholder={t('createPost.audiencePlaceholder')} />
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

      {/* Location */}
      <div className="space-y-2">
        <Label htmlFor="location">{t('createPost.location')}</Label>
        <Input
          id="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder={t('createPost.locationPlaceholder')}
        />
      </div>

      {/* Collab Details (collapsible) */}
      <div className="space-y-2">
        <button
          type="button"
          onClick={() => setShowDetails(!showDetails)}
          className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
        >
          {showDetails ? t('createPost.hideDetails') : t('createPost.showDetails')}
        </button>
        {showDetails && (
          <div className="space-y-4 rounded-lg border p-4">
            <div className="space-y-2">
              <Label htmlFor="timeline">{t('common.timeline')}</Label>
              <Input
                id="timeline"
                value={timeline}
                onChange={(e) => setTimeline(e.target.value)}
                placeholder={t('createPost.timelinePlaceholder')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="deliverables">{t('common.deliverables')}</Label>
              <Textarea
                id="deliverables"
                value={deliverables}
                onChange={(e) => setDeliverables(e.target.value)}
                placeholder={t('createPost.deliverablesPH')}
                maxLength={500}
                rows={3}
              />
              <p className="text-xs text-muted-foreground">
                {deliverables.length}/500
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="requirements">{t('common.requirements')}</Label>
              <Textarea
                id="requirements"
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                placeholder={t('createPost.requirementsPH')}
                maxLength={500}
                rows={3}
              />
              <p className="text-xs text-muted-foreground">
                {requirements.length}/500
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="compensation">{t('common.compensation')}</Label>
              <Input
                id="compensation"
                value={compensation}
                onChange={(e) => setCompensation(e.target.value)}
                placeholder={t('createPost.compensationPH')}
              />
            </div>
          </div>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={saving}>
        {saving ? t('createPost.creating') : t('createPost.create')}
      </Button>
    </form>
  )
}
