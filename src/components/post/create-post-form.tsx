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
import { NICHES, COLLAB_TYPES, FOLLOWER_RANGES, DELIVERABLE_CONTENT_TYPES, DELIVERABLE_QUANTITIES, MAX_COLLABORATORS, TITLE_TEMPLATES, VIDEO_RESOLUTIONS } from '@/lib/constants'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { useLanguage, getCollabTypeLabel, getNicheLabel, getDeliverableTypeLabel, getTitleTemplateLabel } from '@/lib/i18n'
import { Plus, X } from 'lucide-react'
import { format } from 'date-fns'
import { DatePicker } from '@/components/ui/date-picker'
import type { DeliverableSlot, Json } from '@/types/database'

interface CreatePostFormProps {
  userId: string
}

export function CreatePostForm({ userId }: CreatePostFormProps) {
  const [titleTemplate, setTitleTemplate] = useState('__custom__')
  const [titleDetail, setTitleDetail] = useState('')
  const [description, setDescription] = useState('')
  const [collabType, setCollabType] = useState('')
  const [nicheTags, setNicheTags] = useState<string[]>([])
  const [audienceMin, setAudienceMin] = useState(0)
  const [audienceMax, setAudienceMax] = useState(0)
  const [location, setLocation] = useState('')
  const [showDetails, setShowDetails] = useState(false)
  const [timeline, setTimeline] = useState<Date | undefined>(undefined)
  const [deliverableSlots, setDeliverableSlots] = useState<DeliverableSlot[]>([])
  const [requirements, setRequirements] = useState('')
  const [compensation, setCompensation] = useState('')
  const [videoResolution, setVideoResolution] = useState('')
  const [maxCollaborators, setMaxCollaborators] = useState(1)
  const [collabMode, setCollabMode] = useState('separate')
  const [saving, setSaving] = useState(false)

  const router = useRouter()
  const supabase = createClient()
  const { t } = useLanguage()

  const fullTitle = titleTemplate !== '__custom__'
    ? `${getTitleTemplateLabel(t, titleTemplate)}: ${titleDetail}`.trim()
    : titleDetail.trim()

  const toggleNiche = (niche: string) => {
    setNicheTags((prev) =>
      prev.includes(niche) ? prev.filter((n) => n !== niche) : [...prev, niche]
    )
  }

  const handleAudienceRange = (value: string) => {
    if (value === '__any__') {
      setAudienceMin(0)
      setAudienceMax(0)
      return
    }
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
    return range?.label || '__any__'
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!fullTitle) {
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

    // Build deliverables text summary from slots for backward compat
    const filledSlots = deliverableSlots.filter((s) => s.content_type)
    const deliverablesText = filledSlots.length > 0
      ? filledSlots.map((s) => `${s.quantity}x ${s.content_type}${s.description ? ` — ${s.description}` : ''}`).join('\n')
      : null

    const { error } = await supabase.from('collab_posts').insert({
      user_id: userId,
      title: fullTitle,
      description: description.trim(),
      collab_type: collabType,
      niche_tags: nicheTags,
      preferred_audience_min: audienceMin,
      preferred_audience_max: audienceMax,
      location: location.trim() || null,
      timeline: timeline ? format(timeline, 'yyyy-MM-dd') : null,
      deliverables: deliverablesText,
      deliverable_slots: filledSlots.length > 0 ? (filledSlots as unknown as Json) : null,
      requirements: requirements.trim() || null,
      compensation: compensation.trim() || null,
      video_resolution: videoResolution || null,
      max_collaborators: maxCollaborators,
      collab_mode: maxCollaborators > 1 ? collabMode : 'separate',
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

      {/* Title: Template dropdown + detail input */}
      <div className="space-y-2">
        <Label>{t('createPost.titleLabel')}</Label>
        <div className="flex items-center gap-2">
          <Select
            value={titleTemplate}
            onValueChange={setTitleTemplate}
          >
            <SelectTrigger className="w-[180px] shrink-0">
              <SelectValue placeholder={t('createPost.titleTemplatePlaceholder')} />
            </SelectTrigger>
            <SelectContent>
              {TITLE_TEMPLATES.map((tmpl) => (
                <SelectItem key={tmpl} value={tmpl}>
                  {getTitleTemplateLabel(t, tmpl)}
                </SelectItem>
              ))}
              <SelectItem value="__custom__">
                {t('createPost.customTitle')}
              </SelectItem>
            </SelectContent>
          </Select>
          {titleTemplate !== '__custom__' && (
            <span className="text-muted-foreground font-medium">:</span>
          )}
          <Input
            value={titleDetail}
            onChange={(e) => setTitleDetail(e.target.value)}
            placeholder={titleTemplate !== '__custom__' ? t('createPost.titleDetailPlaceholder') : t('createPost.titlePlaceholder')}
            className="min-w-0 flex-1"
            maxLength={100}
          />
        </div>
        {titleTemplate !== '__custom__' && (
          <p className="text-xs text-muted-foreground">
            {fullTitle}
          </p>
        )}
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
            <SelectItem value="__any__">{t('profile.followerAny')}</SelectItem>
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

      {/* Number of Collaborators */}
      <div className="space-y-2">
        <Label>{t('collab.maxCollaborators')}</Label>
        <Select
          value={String(maxCollaborators)}
          onValueChange={(v) => setMaxCollaborators(Number(v))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: MAX_COLLABORATORS }, (_, i) => i + 1).map((n) => (
              <SelectItem key={n} value={String(n)}>
                {n}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Chat Mode - only show when maxCollaborators > 1 */}
      {maxCollaborators > 1 && (
        <div className="space-y-2">
          <Label>{t('collab.collabMode')}</Label>
          <Select value={collabMode} onValueChange={setCollabMode}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="separate">
                {t('collab.separate')}
              </SelectItem>
              <SelectItem value="group">
                {t('collab.group')}
              </SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            {collabMode === 'group' ? t('collab.groupDesc') : t('collab.separateDesc')}
          </p>
        </div>
      )}

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
              <Label>{t('common.timeline')}</Label>
              <DatePicker
                value={timeline}
                onChange={setTimeline}
                placeholder={t('createPost.selectDate')}
              />
            </div>
            {/* Video Resolution */}
            <div className="space-y-2">
              <Label>{t('createPost.videoResolution')}</Label>
              <Select value={videoResolution} onValueChange={setVideoResolution}>
                <SelectTrigger>
                  <SelectValue placeholder={t('createPost.videoResolutionPlaceholder')} />
                </SelectTrigger>
                <SelectContent>
                  {VIDEO_RESOLUTIONS.map((res) => (
                    <SelectItem key={res.value} value={res.value}>
                      {res.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Deliverable Slots */}
            <div className="space-y-3">
              <Label>{t('deliverable.whatYouNeed' as any)}</Label>
              {deliverableSlots.map((slot, idx) => (
                <div key={idx} className="space-y-2 rounded-lg border p-3">
                  <div className="flex items-center gap-2">
                    {/* Content Type */}
                    <Select
                      value={slot.content_type}
                      onValueChange={(val) => {
                        const updated = [...deliverableSlots]
                        updated[idx] = { ...slot, content_type: val }
                        setDeliverableSlots(updated)
                      }}
                    >
                      <SelectTrigger className="w-[130px]">
                        <SelectValue placeholder={t('deliverable.contentType' as any)} />
                      </SelectTrigger>
                      <SelectContent>
                        {DELIVERABLE_CONTENT_TYPES.map((ct) => (
                          <SelectItem key={ct} value={ct}>
                            {getDeliverableTypeLabel(t, ct)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {/* Quantity */}
                    <Select
                      value={slot.quantity}
                      onValueChange={(val) => {
                        const updated = [...deliverableSlots]
                        updated[idx] = { ...slot, quantity: val }
                        setDeliverableSlots(updated)
                      }}
                    >
                      <SelectTrigger className="w-[70px]">
                        <SelectValue placeholder={t('deliverable.quantity' as any)} />
                      </SelectTrigger>
                      <SelectContent>
                        {DELIVERABLE_QUANTITIES.map((q) => (
                          <SelectItem key={q} value={q}>{q}x</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <div className="flex-1" />

                    {/* Remove */}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive hover:text-destructive"
                      onClick={() => setDeliverableSlots(deliverableSlots.filter((_, i) => i !== idx))}
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>

                  {/* Details input */}
                  <Input
                    value={slot.description}
                    onChange={(e) => {
                      const updated = [...deliverableSlots]
                      updated[idx] = { ...slot, description: e.target.value }
                      setDeliverableSlots(updated)
                    }}
                    placeholder={t('deliverable.detailsPlaceholder' as any)}
                    className="text-sm"
                  />
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setDeliverableSlots([...deliverableSlots, { content_type: '', quantity: '1', description: '' }])}
              >
                <Plus className="mr-1 h-3.5 w-3.5" />
                {t('deliverable.addSlot' as any)}
              </Button>
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
