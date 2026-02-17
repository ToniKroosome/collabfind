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
      toast.error('Please enter a title')
      return
    }
    if (!description.trim()) {
      toast.error('Please enter a description')
      return
    }
    if (!collabType) {
      toast.error('Please select a collab type')
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
      toast.error('Failed to create post')
      setSaving(false)
      return
    }

    toast.success('Collab post created!')
    router.push('/feed')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 py-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Create a Collab Post</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Describe the collaboration you&apos;re looking for
        </p>
      </div>

      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Looking for a tech reviewer to collab on a video"
          required
          maxLength={100}
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe what you're looking for, what you'll do together, and what you bring to the table..."
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
        <Label>Collab Type *</Label>
        <Select value={collabType} onValueChange={setCollabType}>
          <SelectTrigger>
            <SelectValue placeholder="Select the type of collaboration" />
          </SelectTrigger>
          <SelectContent>
            {COLLAB_TYPES.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Niche Tags */}
      <div className="space-y-2">
        <Label>Niche Tags</Label>
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
              {niche}
            </Badge>
          ))}
        </div>
      </div>

      {/* Preferred Audience Size */}
      <div className="space-y-2">
        <Label>Preferred Partner Audience Size</Label>
        <Select value={getCurrentRange()} onValueChange={handleAudienceRange}>
          <SelectTrigger>
            <SelectValue placeholder="Any size is fine" />
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
        <Label htmlFor="location">Location (optional)</Label>
        <Input
          id="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="e.g., Bangkok, Thailand or Remote"
        />
      </div>

      {/* Collab Details (collapsible) */}
      <div className="space-y-2">
        <button
          type="button"
          onClick={() => setShowDetails(!showDetails)}
          className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
        >
          {showDetails ? '− Hide collab details' : '+ Add collab details (optional)'}
        </button>
        {showDetails && (
          <div className="space-y-4 rounded-lg border p-4">
            <div className="space-y-2">
              <Label htmlFor="timeline">Timeline</Label>
              <Input
                id="timeline"
                value={timeline}
                onChange={(e) => setTimeline(e.target.value)}
                placeholder="e.g., March 2026, Next 2 weeks, Flexible"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="deliverables">Deliverables</Label>
              <Textarea
                id="deliverables"
                value={deliverables}
                onChange={(e) => setDeliverables(e.target.value)}
                placeholder="e.g., Each person posts 1 Reel tagging the other"
                maxLength={500}
                rows={3}
              />
              <p className="text-xs text-muted-foreground">
                {deliverables.length}/500
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="requirements">Requirements</Label>
              <Textarea
                id="requirements"
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                placeholder="e.g., Must have 10K+ followers on Instagram"
                maxLength={500}
                rows={3}
              />
              <p className="text-xs text-muted-foreground">
                {requirements.length}/500
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="compensation">Compensation</Label>
              <Input
                id="compensation"
                value={compensation}
                onChange={(e) => setCompensation(e.target.value)}
                placeholder="e.g., Cross-promotion only, Revenue split 50/50"
              />
            </div>
          </div>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={saving}>
        {saving ? 'Creating...' : 'Create Collab Post'}
      </Button>
    </form>
  )
}
