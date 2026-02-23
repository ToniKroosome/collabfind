export const NICHES = [
  'tech',
  'beauty',
  'food',
  'travel',
  'fitness',
  'fashion',
  'gaming',
  'music',
  'education',
  'lifestyle',
  'business',
  'comedy',
  'art',
  'health',
  'photography',
  'pet',
] as const

export type Niche = (typeof NICHES)[number]

export const COLLAB_TYPES = [
  { value: 'video', label: 'Video Collab' },
  { value: 'photo', label: 'Photo Shoot' },
  { value: 'livestream', label: 'Livestream' },
  { value: 'podcast', label: 'Podcast' },
  { value: 'blog', label: 'Blog Post' },
  { value: 'event', label: 'Event' },
  { value: 'giveaway', label: 'Giveaway' },
  { value: 'other', label: 'Other' },
] as const

export type CollabType = (typeof COLLAB_TYPES)[number]['value']

export const FOLLOWER_RANGES = [
  { min: 0, max: 1000, label: '0 - 1K' },
  { min: 1000, max: 10000, label: '1K - 10K' },
  { min: 10000, max: 50000, label: '10K - 50K' },
  { min: 50000, max: 100000, label: '50K - 100K' },
  { min: 100000, max: 500000, label: '100K - 500K' },
  { min: 500000, max: 0, label: '500K+' },
] as const

export const COLLAB_TYPE_COLORS: Record<string, string> = {
  video: 'bg-red-100 text-red-700',
  photo: 'bg-pink-100 text-pink-700',
  livestream: 'bg-purple-100 text-purple-700',
  podcast: 'bg-blue-100 text-blue-700',
  blog: 'bg-green-100 text-green-700',
  event: 'bg-yellow-100 text-yellow-700',
  giveaway: 'bg-orange-100 text-orange-700',
  other: 'bg-gray-100 text-gray-700',
}

export const MATCH_STATUS_COLORS: Record<string, string> = {
  active: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-gray-100 text-gray-700',
}

export const CONTRACT_STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  accepted: 'bg-green-100 text-green-700',
  declined: 'bg-red-100 text-red-700',
  completed: 'bg-blue-100 text-blue-700',
  cancelled: 'bg-gray-100 text-gray-700',
}

export const SUBMISSION_STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  approved: 'bg-green-100 text-green-700',
  revision_requested: 'bg-orange-100 text-orange-700',
}

export const DELIVERABLE_CONTENT_TYPES = [
  'video',
  'photo',
  'reel',
  'story',
  'post',
  'blog',
  'livestream',
  'review',
  'shoutout',
  'other',
] as const

export type DeliverableContentType = (typeof DELIVERABLE_CONTENT_TYPES)[number]

export const DELIVERABLE_QUANTITIES = [
  '1',
  '2',
  '3',
  '4',
  '5',
] as const

export const MAX_COLLABORATORS = 10

export const TITLE_TEMPLATES = [
  'dog_video_collab',
  'dog_product_review',
  'dog_photo_shoot',
  'dog_park_meetup',
  'pet_lifestyle_content',
  'dog_training_tips',
] as const

export type TitleTemplate = (typeof TITLE_TEMPLATES)[number]

export const EDIT_LEVELS = [
  'full_edit',
  'rough_cut',
  'raw_footage',
] as const

export type EditLevel = (typeof EDIT_LEVELS)[number]

export const VIDEO_RESOLUTIONS = [
  { value: '1080x1920', label: '1080x1920 (Vertical/Reel)' },
  { value: '1920x1080', label: '1920x1080 (Landscape)' },
  { value: '1080x1080', label: '1080x1080 (Square)' },
  { value: '720x1280', label: '720x1280 (Vertical HD)' },
  { value: '1280x720', label: '1280x720 (Landscape HD)' },
  { value: '3840x2160', label: '3840x2160 (4K)' },
] as const
