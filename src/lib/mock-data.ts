// ============================================================
// MOCK DATA — Toggle this flag to show/hide demo content
// Set to false to hide all mock data instantly
// ============================================================
export const SHOW_MOCK_DATA = true

// --- Mock Profiles ---

const mockProfiles = [
  {
    id: 'mock-001', username: 'example-beauty', full_name: '[Example] Beauty Creator',
    bio: '(Sample profile) Beauty & lifestyle creator sharing everyday glam looks and self-care routines',
    avatar_url: null, niche: ['beauty', 'lifestyle'],
    follower_count_min: 50000, follower_count_max: 100000,
    instagram_url: null, tiktok_url: null,
    youtube_url: null, twitter_url: null,
    location: 'Los Angeles, CA', is_profile_complete: true,
    created_at: '', updated_at: '',
  },
  {
    id: 'mock-002', username: 'example-fitness', full_name: '[Example] Fitness Coach',
    bio: '(Sample profile) Fitness coach & meal prep enthusiast. Helping people get strong without the gym bro culture',
    avatar_url: null, niche: ['fitness', 'health', 'food'],
    follower_count_min: 10000, follower_count_max: 50000,
    instagram_url: null, tiktok_url: null,
    youtube_url: null, twitter_url: null,
    location: 'Miami, FL', is_profile_complete: true,
    created_at: '', updated_at: '',
  },
  {
    id: 'mock-003', username: 'example-tech', full_name: '[Example] Tech Reviewer',
    bio: '(Sample profile) Tech reviewer & gadget nerd. Breaking down the latest tech in under 60 seconds.',
    avatar_url: null, niche: ['tech', 'education'],
    follower_count_min: 100000, follower_count_max: 500000,
    instagram_url: null, tiktok_url: null,
    youtube_url: null, twitter_url: null,
    location: 'San Francisco, CA', is_profile_complete: true,
    created_at: '', updated_at: '',
  },
  {
    id: 'mock-004', username: 'example-travel', full_name: '[Example] Travel Photographer',
    bio: '(Sample profile) Travel photographer capturing hidden gems around the world.',
    avatar_url: null, niche: ['travel', 'photography'],
    follower_count_min: 10000, follower_count_max: 50000,
    instagram_url: null, tiktok_url: null,
    youtube_url: null, twitter_url: null,
    location: 'Lisbon, Portugal', is_profile_complete: true,
    created_at: '', updated_at: '',
  },
  {
    id: 'mock-005', username: 'example-food', full_name: '[Example] Food Blogger',
    bio: '(Sample profile) Food blogger & home chef. Turning comfort food into content.',
    avatar_url: null, niche: ['food', 'lifestyle'],
    follower_count_min: 1000, follower_count_max: 10000,
    instagram_url: null, tiktok_url: null,
    youtube_url: null, twitter_url: null,
    location: 'Nashville, TN', is_profile_complete: true,
    created_at: '', updated_at: '',
  },
  {
    id: 'mock-006', username: 'example-gaming', full_name: '[Example] Gaming Streamer',
    bio: '(Sample profile) Variety streamer & gaming content creator. Mostly indie games, horror, and co-op chaos.',
    avatar_url: null, niche: ['gaming', 'comedy', 'tech'],
    follower_count_min: 50000, follower_count_max: 100000,
    instagram_url: null, tiktok_url: null,
    youtube_url: null, twitter_url: null,
    location: 'Seattle, WA', is_profile_complete: true,
    created_at: '', updated_at: '',
  },
  {
    id: 'mock-007', username: 'example-fashion', full_name: '[Example] Fashion Creator',
    bio: '(Sample profile) Slow fashion advocate & thrift flip queen. Style without the big footprint.',
    avatar_url: null, niche: ['fashion', 'lifestyle', 'art'],
    follower_count_min: 10000, follower_count_max: 50000,
    instagram_url: null, tiktok_url: null,
    youtube_url: null, twitter_url: null,
    location: 'Stockholm, Sweden', is_profile_complete: true,
    created_at: '', updated_at: '',
  },
  {
    id: 'mock-008', username: 'example-business', full_name: '[Example] Business Creator',
    bio: '(Sample profile) Breaking down money, investing, and side hustles in plain English.',
    avatar_url: null, niche: ['business', 'education'],
    follower_count_min: 100000, follower_count_max: 500000,
    instagram_url: null, tiktok_url: null,
    youtube_url: null, twitter_url: null,
    location: 'New York, NY', is_profile_complete: true,
    created_at: '', updated_at: '',
  },
  {
    id: 'mock-009', username: 'example-art', full_name: '[Example] Digital Artist',
    bio: '(Sample profile) Digital artist & illustrator. Characters, fan art, and creative collabs!',
    avatar_url: null, niche: ['art', 'comedy'],
    follower_count_min: 1000, follower_count_max: 10000,
    instagram_url: null, tiktok_url: null,
    youtube_url: null, twitter_url: null,
    location: 'Austin, TX', is_profile_complete: true,
    created_at: '', updated_at: '',
  },
  {
    id: 'mock-010', username: 'example-music', full_name: '[Example] Music Producer',
    bio: '(Sample profile) Music producer & songwriter. Looking for creators who need original tracks.',
    avatar_url: null, niche: ['music', 'art'],
    follower_count_min: 10000, follower_count_max: 50000,
    instagram_url: null, tiktok_url: null,
    youtube_url: null, twitter_url: null,
    location: 'London, UK', is_profile_complete: true,
    created_at: '', updated_at: '',
  },
] as const

function profileById(id: string) {
  return mockProfiles.find((p) => p.id === id)!
}

function ago(hours: number): string {
  return new Date(Date.now() - hours * 60 * 60 * 1000).toISOString()
}

// --- Mock Collab Posts (with joined profile) ---

export const MOCK_POSTS = [
  {
    id: 'mock-post-001', user_id: 'mock-001',
    title: '[Example] Looking for a photographer for skincare flat-lays',
    description: '(This is a sample post to show you how CollabFind works!) I have a skincare collection launch coming up and need someone who can style and shoot beautiful flat-lay product photos. Ideally someone in LA who knows how to work with natural light.',
    collab_type: 'photo', niche_tags: ['beauty', 'photography'],
    preferred_audience_min: 1000, preferred_audience_max: 100000,
    location: 'Los Angeles, CA', is_open: true,
    timeline: 'March 15-25, 2026',
    deliverables: 'Each person gets 10 edited photos for their feed + 3 BTS Reels',
    requirements: 'Must have product photography experience. LA-based preferred.',
    compensation: 'Cross-promotion + you keep the photos for your portfolio',
    created_at: ago(2), updated_at: ago(2),
    profiles: profileById('mock-001'),
  },
  {
    id: 'mock-post-002', user_id: 'mock-002',
    title: '[Example] 30-day fitness challenge — need a partner!',
    description: '(This is a sample post) Want to do a 30-day fitness transformation challenge where we both document our progress and tag each other. Thinking daily TikToks + a recap YouTube video at the end.',
    collab_type: 'video', niche_tags: ['fitness', 'health'],
    preferred_audience_min: 1000, preferred_audience_max: 50000,
    location: 'Miami, FL', is_open: true,
    timeline: 'Starting next Monday, 30 days',
    deliverables: 'Daily TikTok posts + 1 recap YouTube video at the end',
    requirements: null,
    compensation: 'Cross-promotion only',
    created_at: ago(5), updated_at: ago(5),
    profiles: profileById('mock-002'),
  },
  {
    id: 'mock-post-003', user_id: 'mock-003',
    title: '[Example] Guest spot on my tech podcast',
    description: '(This is a sample post) I host a weekly podcast where we talk about the latest tech drops and hot takes. Looking for a guest who has strong opinions about AI, smartphones, or smart home tech.',
    collab_type: 'podcast', niche_tags: ['tech', 'education'],
    preferred_audience_min: 10000, preferred_audience_max: 500000,
    location: null, is_open: true,
    timeline: 'Flexible — recording weekly',
    deliverables: '1 podcast episode (45-60 min). I handle all editing and publishing.',
    requirements: 'Must have a good microphone and quiet recording space.',
    compensation: 'Cross-promotion + link in show notes to your channel',
    created_at: ago(24), updated_at: ago(24),
    profiles: profileById('mock-003'),
  },
  {
    id: 'mock-post-004', user_id: 'mock-004',
    title: '[Example] Co-create a "Hidden Lisbon" photo series',
    description: '(This is a sample post) Putting together a photo series showcasing spots in Lisbon that tourists never find. Looking for another travel creator to explore with.',
    collab_type: 'photo', niche_tags: ['travel', 'photography'],
    preferred_audience_min: 1000, preferred_audience_max: 100000,
    location: 'Lisbon, Portugal', is_open: true,
    timeline: null, deliverables: null, requirements: null, compensation: null,
    created_at: ago(3), updated_at: ago(3),
    profiles: profileById('mock-004'),
  },
  {
    id: 'mock-post-005', user_id: 'mock-005',
    title: '[Example] Recipe swap blog post — your cuisine meets mine',
    description: '(This is a sample post) I want to do a recipe swap! You teach me one of your signature dishes, I teach you one of mine, and we each write a blog post about the experience.',
    collab_type: 'blog', niche_tags: ['food', 'lifestyle'],
    preferred_audience_min: 0, preferred_audience_max: 50000,
    location: null, is_open: true,
    timeline: null, deliverables: null, requirements: null, compensation: null,
    created_at: ago(8), updated_at: ago(8),
    profiles: profileById('mock-005'),
  },
  {
    id: 'mock-post-006', user_id: 'mock-006',
    title: '[Example] Co-op horror game livestream',
    description: '(This is a sample post) Looking for another streamer to play Lethal Company or Phasmophobia together on a Friday night stream. Dual-stream setup and raid each other afterward.',
    collab_type: 'livestream', niche_tags: ['gaming', 'comedy'],
    preferred_audience_min: 10000, preferred_audience_max: 500000,
    location: null, is_open: true,
    timeline: null, deliverables: null, requirements: null, compensation: null,
    created_at: ago(12), updated_at: ago(12),
    profiles: profileById('mock-006'),
  },
  {
    id: 'mock-post-007', user_id: 'mock-007',
    title: '[Example] Thrift flip challenge — $20 budget, 1 outfit',
    description: '(This is a sample post) We each get $20 at a thrift store and have to style a complete outfit. Film the process, reveal at the end. Perfect for TikTok or YouTube Shorts.',
    collab_type: 'video', niche_tags: ['fashion', 'lifestyle'],
    preferred_audience_min: 1000, preferred_audience_max: 50000,
    location: null, is_open: true,
    timeline: null, deliverables: null, requirements: null, compensation: null,
    created_at: ago(6), updated_at: ago(6),
    profiles: profileById('mock-007'),
  },
  {
    id: 'mock-post-008', user_id: 'mock-008',
    title: '[Example] Looking for creators to discuss side hustles',
    description: '(This is a sample post) Recording a series on "Side Hustles That Actually Work" and want to feature creators who\'ve built real income streams beyond brand deals.',
    collab_type: 'podcast', niche_tags: ['business', 'education'],
    preferred_audience_min: 5000, preferred_audience_max: 500000,
    location: null, is_open: true,
    timeline: 'Rolling — recording 2 episodes per week',
    deliverables: '30-min interview. I handle editing, thumbnails, and publishing.',
    requirements: 'Must have at least one income stream beyond brand deals (course, product, consulting, etc.)',
    compensation: 'Revenue split 50/50 on ad revenue for your episode',
    created_at: ago(27), updated_at: ago(27),
    profiles: profileById('mock-008'),
  },
  {
    id: 'mock-post-009', user_id: 'mock-009',
    title: '[Example] Art + merch giveaway collab',
    description: '(This is a sample post) Team up with another creator for a joint giveaway. I\'ll contribute custom art prints and stickers. You bring your own merch or product.',
    collab_type: 'giveaway', niche_tags: ['art'],
    preferred_audience_min: 500, preferred_audience_max: 50000,
    location: null, is_open: true,
    timeline: null, deliverables: null, requirements: null, compensation: null,
    created_at: ago(4), updated_at: ago(4),
    profiles: profileById('mock-009'),
  },
  {
    id: 'mock-post-010', user_id: 'mock-010',
    title: '[Example] Need a creator for a music video shoot',
    description: '(This is a sample post) Just finished producing a new track and need a creative director or content creator to help plan and shoot a simple music video.',
    collab_type: 'video', niche_tags: ['music', 'art'],
    preferred_audience_min: 1000, preferred_audience_max: 100000,
    location: 'London, UK', is_open: true,
    timeline: null, deliverables: null, requirements: null, compensation: null,
    created_at: ago(7), updated_at: ago(7),
    profiles: profileById('mock-010'),
  },
  {
    id: 'mock-post-011', user_id: 'mock-003',
    title: '[Example] iPhone vs Android — debate video',
    description: '(This is a sample post) Friendly debate-style video: iPhone vs Android. Need someone who genuinely loves iPhone to make the case. Fun, informative, and a little spicy.',
    collab_type: 'video', niche_tags: ['tech'],
    preferred_audience_min: 10000, preferred_audience_max: 500000,
    location: null, is_open: true,
    timeline: null, deliverables: null, requirements: null, compensation: null,
    created_at: ago(48), updated_at: ago(48),
    profiles: profileById('mock-003'),
  },
  {
    id: 'mock-post-012', user_id: 'mock-002',
    title: '[Example] Pop-up workout event in Miami',
    description: '(This is a sample post) Planning a free outdoor workout event in Miami Beach for creators and their followers. Looking for 2-3 other fitness or wellness creators to co-host.',
    collab_type: 'event', niche_tags: ['fitness', 'health', 'lifestyle'],
    preferred_audience_min: 5000, preferred_audience_max: 500000,
    location: 'Miami, FL', is_open: true,
    timeline: null, deliverables: null, requirements: null, compensation: null,
    created_at: ago(10), updated_at: ago(10),
    profiles: profileById('mock-002'),
  },
]

// --- Mock Matches ---

export const MOCK_MATCHES = [
  {
    id: 'mock-match-001',
    interest_id: 'mock-int-001', post_id: 'mock-post-001',
    user_a: 'mock-001', user_b: 'mock-004',
    status: 'active',
    created_at: ago(1),
    collab_posts: { id: 'mock-post-001', title: '[Example] Looking for a photographer for skincare flat-lays', collab_type: 'photo' },
    partner_a: profileById('mock-001'),
    partner_b: profileById('mock-004'),
  },
  {
    id: 'mock-match-002',
    interest_id: 'mock-int-002', post_id: 'mock-post-002',
    user_a: 'mock-002', user_b: 'mock-005',
    status: 'completed',
    created_at: ago(3),
    collab_posts: { id: 'mock-post-002', title: '[Example] 30-day fitness challenge — need a partner!', collab_type: 'video' },
    partner_a: profileById('mock-002'),
    partner_b: profileById('mock-005'),
  },
  {
    id: 'mock-match-003',
    interest_id: 'mock-int-006', post_id: 'mock-post-011',
    user_a: 'mock-003', user_b: 'mock-008',
    status: 'active',
    created_at: ago(22),
    collab_posts: { id: 'mock-post-011', title: '[Example] iPhone vs Android — debate video', collab_type: 'video' },
    partner_a: profileById('mock-003'),
    partner_b: profileById('mock-008'),
  },
]

// --- Mock Conversations (messages grouped by match) ---

export const MOCK_CONVERSATIONS = [
  {
    match: MOCK_MATCHES[0],
    lastMessage: {
      id: 'mock-msg-004', match_id: 'mock-match-001', sender_id: 'mock-004',
      content: '(Example chat) Perfect! Should I bring my own equipment or will the studio have everything?',
      is_read: false, created_at: ago(0.17),
    },
    unreadCount: 1,
  },
  {
    match: MOCK_MATCHES[1],
    lastMessage: {
      id: 'mock-msg-008', match_id: 'mock-match-002', sender_id: 'mock-005',
      content: '(Example chat) Sounds like a plan! I\'ll draft some recipe ideas tonight. This is going to be great!',
      is_read: true, created_at: ago(2.3),
    },
    unreadCount: 0,
  },
  {
    match: MOCK_MATCHES[2],
    lastMessage: {
      id: 'mock-msg-012', match_id: 'mock-match-003', sender_id: 'mock-008',
      content: '(Example chat) I\'ll do ecosystem, privacy, resale value, app optimization, and iMessage. Let\'s make this great!',
      is_read: false, created_at: ago(18),
    },
    unreadCount: 1,
  },
]

// --- Mock Chat Messages (keyed by match id) ---

export const MOCK_MESSAGES: Record<string, Array<{
  id: string; match_id: string; sender_id: string; content: string; is_read: boolean; created_at: string
}>> = {
  'mock-match-001': [
    { id: 'mock-msg-001', match_id: 'mock-match-001', sender_id: 'mock-001',
      content: '(Example chat) Hey! So excited to collab! When are you available for the shoot?',
      is_read: true, created_at: ago(0.75) },
    { id: 'mock-msg-002', match_id: 'mock-match-001', sender_id: 'mock-004',
      content: '(Example chat) I\'m free March 15-25. Somewhere with good natural light would be ideal — maybe a rooftop?',
      is_read: true, created_at: ago(0.67) },
    { id: 'mock-msg-003', match_id: 'mock-match-001', sender_id: 'mock-001',
      content: '(Example chat) Love that! I know a great studio with floor-to-ceiling windows. I\'ll send the details!',
      is_read: true, created_at: ago(0.58) },
    { id: 'mock-msg-004', match_id: 'mock-match-001', sender_id: 'mock-004',
      content: '(Example chat) Perfect! Should I bring my own equipment or will the studio have everything?',
      is_read: false, created_at: ago(0.17) },
  ],
  'mock-match-002': [
    { id: 'mock-msg-005', match_id: 'mock-match-002', sender_id: 'mock-002',
      content: '(Example chat) Welcome aboard! Love the meal prep angle. When do you want to start?',
      is_read: true, created_at: ago(2.8) },
    { id: 'mock-msg-006', match_id: 'mock-match-002', sender_id: 'mock-005',
      content: '(Example chat) How about next Monday? I could do "what I ate" posts alongside your workout routines.',
      is_read: true, created_at: ago(2.7) },
    { id: 'mock-msg-007', match_id: 'mock-match-002', sender_id: 'mock-002',
      content: '(Example chat) Monday works! Let\'s hash out the content calendar — Day 1 intro, then alternating workout/meal posts.',
      is_read: true, created_at: ago(2.5) },
    { id: 'mock-msg-008', match_id: 'mock-match-002', sender_id: 'mock-005',
      content: '(Example chat) Sounds like a plan! I\'ll draft some recipe ideas tonight. This is going to be great!',
      is_read: true, created_at: ago(2.3) },
  ],
  'mock-match-003': [
    { id: 'mock-msg-009', match_id: 'mock-match-003', sender_id: 'mock-003',
      content: '(Example chat) Great, an iPhone defender! Want to do a quick outline call this week?',
      is_read: true, created_at: ago(21) },
    { id: 'mock-msg-010', match_id: 'mock-match-003', sender_id: 'mock-008',
      content: '(Example chat) I\'m free Thursday or Friday. Should we each prepare 5 talking points?',
      is_read: true, created_at: ago(20) },
    { id: 'mock-msg-011', match_id: 'mock-match-003', sender_id: 'mock-003',
      content: '(Example chat) Friday works. I\'ll cover cameras, customization, app quality, value, and repairability.',
      is_read: true, created_at: ago(19) },
    { id: 'mock-msg-012', match_id: 'mock-match-003', sender_id: 'mock-008',
      content: '(Example chat) I\'ll do ecosystem, privacy, resale value, app optimization, and iMessage. Let\'s make this great!',
      is_read: false, created_at: ago(18) },
  ],
}

// Helper to find a mock match by ID
export function getMockMatch(matchId: string) {
  return MOCK_MATCHES.find((m) => m.id === matchId)
}

// --- Mock Notifications ---

export const MOCK_NOTIFICATIONS = [
  {
    id: 'mock-notif-001', user_id: '', type: 'new_message',
    title: '(Example) New message from Travel Photographer',
    body: 'Should I bring my own equipment or will the studio have everything?',
    data: { match_id: 'mock-match-001' }, is_read: false, created_at: ago(0.17),
  },
  {
    id: 'mock-notif-002', user_id: '', type: 'new_interest',
    title: '(Example) Gaming Streamer is interested in your collab!',
    body: 'Guest spot on my tech podcast',
    data: { post_id: 'mock-post-003' }, is_read: false, created_at: ago(2),
  },
  {
    id: 'mock-notif-003', user_id: '', type: 'new_match',
    title: '(Example) You matched with Travel Photographer!',
    body: 'You can now message each other about your collab.',
    data: { match_id: 'mock-match-001' }, is_read: true, created_at: ago(1),
  },
  {
    id: 'mock-notif-004', user_id: '', type: 'interest_accepted',
    title: '(Example) Beauty Creator accepted your interest!',
    body: 'Looking for a photographer for skincare flat-lays',
    data: { post_id: 'mock-post-001' }, is_read: true, created_at: ago(1),
  },
  {
    id: 'mock-notif-005', user_id: '', type: 'new_interest',
    title: '(Example) Fashion Creator is interested in your collab!',
    body: 'Art + merch giveaway collab',
    data: { post_id: 'mock-post-009' }, is_read: false, created_at: ago(3),
  },
  {
    id: 'mock-notif-006', user_id: '', type: 'new_match',
    title: '(Example) You matched with Food Blogger!',
    body: 'You can now message each other about your collab.',
    data: { match_id: 'mock-match-002' }, is_read: true, created_at: ago(3),
  },
  {
    id: 'mock-notif-007', user_id: '', type: 'new_interest',
    title: '(Example) Music Producer is interested in your collab!',
    body: 'Thrift flip challenge — $20 budget, 1 outfit',
    data: { post_id: 'mock-post-007' }, is_read: false, created_at: ago(5),
  },
  {
    id: 'mock-notif-008', user_id: '', type: 'new_message',
    title: '(Example) New message from Business Creator',
    body: 'I\'ll do ecosystem, privacy, resale value, app optimization...',
    data: { match_id: 'mock-match-003' }, is_read: false, created_at: ago(18),
  },
  {
    id: 'mock-notif-009', user_id: '', type: 'collab_completed',
    title: '(Example) Collab marked as completed!',
    body: 'Fitness Coach marked "30-day fitness challenge" as completed. Leave a review!',
    data: { match_id: 'mock-match-002' }, is_read: false, created_at: ago(0.5),
  },
  {
    id: 'mock-notif-010', user_id: '', type: 'new_review',
    title: '(Example) You received a new review!',
    body: 'Fitness Coach left you a 5-star review',
    data: { match_id: 'mock-match-002', review_id: 'mock-review-001' }, is_read: false, created_at: ago(0.3),
  },
]

// --- Mock Reviews ---

export const MOCK_REVIEWS = [
  {
    id: 'mock-review-001',
    match_id: 'mock-match-002',
    reviewer_id: 'mock-002',
    reviewee_id: 'mock-005',
    rating: 5,
    review_text: '(Example review) Amazing collab partner! Brought incredible ideas and was super professional throughout.',
    created_at: ago(1),
    profiles: profileById('mock-002'),
  },
  {
    id: 'mock-review-002',
    match_id: 'mock-match-002',
    reviewer_id: 'mock-005',
    reviewee_id: 'mock-002',
    rating: 4,
    review_text: '(Example review) Great to work with. Very organized and creative.',
    created_at: ago(1),
    profiles: profileById('mock-005'),
  },
]

// --- Mock Reputation Data ---

export const MOCK_REPUTATION: Record<string, { avgRating: number; count: number }> = {
  'mock-001': { avgRating: 4.8, count: 3 },
  'mock-002': { avgRating: 4.5, count: 5 },
  'mock-003': { avgRating: 4.9, count: 7 },
  'mock-005': { avgRating: 5.0, count: 2 },
  'mock-008': { avgRating: 4.2, count: 4 },
}
