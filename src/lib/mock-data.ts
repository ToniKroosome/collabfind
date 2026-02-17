// ============================================================
// MOCK DATA — Toggle this flag to show/hide demo content
// Set to false to hide all mock data instantly
// ============================================================
export const SHOW_MOCK_DATA = true

// --- Mock Profiles ---

const mockProfiles = [
  {
    id: 'mock-001', username: 'mayachen', full_name: 'Maya Chen',
    bio: 'Beauty & lifestyle creator sharing everyday glam looks and self-care routines ✨',
    avatar_url: null, niche: ['beauty', 'lifestyle'],
    follower_count_min: 50000, follower_count_max: 100000,
    instagram_url: 'https://instagram.com/mayachen', tiktok_url: 'https://tiktok.com/@mayachen',
    youtube_url: 'https://youtube.com/@mayachen', twitter_url: null,
    location: 'Los Angeles, CA', is_profile_complete: true,
    created_at: '', updated_at: '',
  },
  {
    id: 'mock-002', username: 'jakerivera', full_name: 'Jake Rivera',
    bio: 'Fitness coach & meal prep enthusiast. Helping people get strong without the gym bro culture 💪',
    avatar_url: null, niche: ['fitness', 'health', 'food'],
    follower_count_min: 10000, follower_count_max: 50000,
    instagram_url: 'https://instagram.com/jakerivera.fit', tiktok_url: 'https://tiktok.com/@jakefitlife',
    youtube_url: null, twitter_url: null,
    location: 'Miami, FL', is_profile_complete: true,
    created_at: '', updated_at: '',
  },
  {
    id: 'mock-003', username: 'priyatech', full_name: 'Priya Sharma',
    bio: 'Tech reviewer & gadget nerd. Breaking down the latest tech in under 60 seconds.',
    avatar_url: null, niche: ['tech', 'education'],
    follower_count_min: 100000, follower_count_max: 500000,
    instagram_url: 'https://instagram.com/priyatech', tiktok_url: 'https://tiktok.com/@priyatech',
    youtube_url: 'https://youtube.com/@priyatechreviews', twitter_url: 'https://twitter.com/priyatech',
    location: 'San Francisco, CA', is_profile_complete: true,
    created_at: '', updated_at: '',
  },
  {
    id: 'mock-004', username: 'tomaswanders', full_name: 'Tomás García',
    bio: 'Travel photographer capturing hidden gems around the world. Currently based in Lisbon 🌍',
    avatar_url: null, niche: ['travel', 'photography'],
    follower_count_min: 10000, follower_count_max: 50000,
    instagram_url: 'https://instagram.com/tomaswanders', tiktok_url: null,
    youtube_url: null, twitter_url: null,
    location: 'Lisbon, Portugal', is_profile_complete: true,
    created_at: '', updated_at: '',
  },
  {
    id: 'mock-005', username: 'aabordeaux', full_name: 'Aisha Williams',
    bio: 'Food blogger & home chef. Turning comfort food into content. Southern recipes with a twist 🍳',
    avatar_url: null, niche: ['food', 'lifestyle'],
    follower_count_min: 1000, follower_count_max: 10000,
    instagram_url: 'https://instagram.com/aabordeaux', tiktok_url: 'https://tiktok.com/@aabordeaux',
    youtube_url: null, twitter_url: null,
    location: 'Nashville, TN', is_profile_complete: true,
    created_at: '', updated_at: '',
  },
  {
    id: 'mock-006', username: 'kainakamura', full_name: 'Kai Nakamura',
    bio: 'Variety streamer & gaming content creator. Mostly indie games, horror, and co-op chaos 🎮',
    avatar_url: null, niche: ['gaming', 'comedy', 'tech'],
    follower_count_min: 50000, follower_count_max: 100000,
    instagram_url: null, tiktok_url: 'https://tiktok.com/@kainakamura',
    youtube_url: 'https://youtube.com/@kainakamura', twitter_url: 'https://twitter.com/kaiplays',
    location: 'Seattle, WA', is_profile_complete: true,
    created_at: '', updated_at: '',
  },
  {
    id: 'mock-007', username: 'emmalindstrom', full_name: 'Emma Lindström',
    bio: 'Slow fashion advocate & thrift flip queen. Style without the big footprint 🌿',
    avatar_url: null, niche: ['fashion', 'lifestyle', 'art'],
    follower_count_min: 10000, follower_count_max: 50000,
    instagram_url: 'https://instagram.com/emmalindstrom', tiktok_url: 'https://tiktok.com/@emmalindstrom',
    youtube_url: null, twitter_url: null,
    location: 'Stockholm, Sweden', is_profile_complete: true,
    created_at: '', updated_at: '',
  },
  {
    id: 'mock-008', username: 'marcusjcreates', full_name: 'Marcus Johnson',
    bio: 'Breaking down money, investing, and side hustles in plain English. No fluff, no hype.',
    avatar_url: null, niche: ['business', 'education'],
    follower_count_min: 100000, follower_count_max: 500000,
    instagram_url: 'https://instagram.com/marcusjcreates', tiktok_url: 'https://tiktok.com/@marcusjcreates',
    youtube_url: 'https://youtube.com/@marcusjcreates', twitter_url: null,
    location: 'New York, NY', is_profile_complete: true,
    created_at: '', updated_at: '',
  },
  {
    id: 'mock-009', username: 'lilydraws', full_name: 'Lily Park',
    bio: 'Digital artist & illustrator. Characters, fan art, and weird little creatures. Open to creative collabs!',
    avatar_url: null, niche: ['art', 'comedy'],
    follower_count_min: 1000, follower_count_max: 10000,
    instagram_url: 'https://instagram.com/lilydraws', tiktok_url: 'https://tiktok.com/@lilydraws',
    youtube_url: null, twitter_url: 'https://twitter.com/lilydraws',
    location: 'Austin, TX', is_profile_complete: true,
    created_at: '', updated_at: '',
  },
  {
    id: 'mock-010', username: 'danokafor', full_name: 'Daniel Okafor',
    bio: 'Music producer & songwriter. Afrobeats meets lo-fi. Looking for creators who need original tracks 🎵',
    avatar_url: null, niche: ['music', 'art'],
    follower_count_min: 10000, follower_count_max: 50000,
    instagram_url: 'https://instagram.com/danokafor', tiktok_url: 'https://tiktok.com/@danokafor',
    youtube_url: 'https://youtube.com/@danokaformusic', twitter_url: null,
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
    title: 'Looking for a photographer for skincare flat-lays',
    description: 'I have a skincare collection launch coming up and need someone who can style and shoot beautiful flat-lay product photos. Ideally someone in LA who knows how to work with natural light. I\'ll provide all the products and we can both post the content. Would love to cross-promote!',
    collab_type: 'photo', niche_tags: ['beauty', 'photography'],
    preferred_audience_min: 1000, preferred_audience_max: 100000,
    location: 'Los Angeles, CA', is_open: true,
    created_at: ago(2), updated_at: ago(2),
    profiles: profileById('mock-001'),
  },
  {
    id: 'mock-post-002', user_id: 'mock-002',
    title: '30-day fitness challenge — need a partner!',
    description: 'Want to do a 30-day fitness transformation challenge where we both document our progress and tag each other. Thinking daily TikToks + a recap YouTube video at the end. You don\'t need to be a fitness guru — the journey is what makes it relatable.',
    collab_type: 'video', niche_tags: ['fitness', 'health'],
    preferred_audience_min: 1000, preferred_audience_max: 50000,
    location: 'Miami, FL', is_open: true,
    created_at: ago(5), updated_at: ago(5),
    profiles: profileById('mock-002'),
  },
  {
    id: 'mock-post-003', user_id: 'mock-003',
    title: 'Guest spot on my tech podcast — "Unboxed"',
    description: 'I host a weekly podcast called "Unboxed" where we talk about the latest tech drops and hot takes. Looking for a guest who has strong opinions about AI, smartphones, or smart home tech. Remote recording via Riverside.fm. Previous guests have gotten 5-10K new followers from the episode.',
    collab_type: 'podcast', niche_tags: ['tech', 'education'],
    preferred_audience_min: 10000, preferred_audience_max: 500000,
    location: null, is_open: true,
    created_at: ago(24), updated_at: ago(24),
    profiles: profileById('mock-003'),
  },
  {
    id: 'mock-post-004', user_id: 'mock-004',
    title: 'Co-create a "Hidden Lisbon" photo series',
    description: 'I\'m putting together a photo series showcasing spots in Lisbon that tourists never find. Looking for another travel creator to explore with — we\'d split shooting and share the content across both our pages. Bonus if you can do drone footage!',
    collab_type: 'photo', niche_tags: ['travel', 'photography'],
    preferred_audience_min: 1000, preferred_audience_max: 100000,
    location: 'Lisbon, Portugal', is_open: true,
    created_at: ago(3), updated_at: ago(3),
    profiles: profileById('mock-004'),
  },
  {
    id: 'mock-post-005', user_id: 'mock-005',
    title: 'Recipe swap blog post — your cuisine meets mine',
    description: 'I want to do a recipe swap! You teach me one of your signature dishes, I teach you one of mine, and we each write a blog post about the experience. Great for cross-pollinating audiences. Bonus if we can film the cooking process for TikTok too!',
    collab_type: 'blog', niche_tags: ['food', 'lifestyle'],
    preferred_audience_min: 0, preferred_audience_max: 50000,
    location: null, is_open: true,
    created_at: ago(8), updated_at: ago(8),
    profiles: profileById('mock-005'),
  },
  {
    id: 'mock-post-006', user_id: 'mock-006',
    title: 'Co-op horror game livestream 👻',
    description: 'Looking for another streamer to play Lethal Company or Phasmophobia together on a Friday night stream. Ideally someone who\'s funny and doesn\'t take themselves too seriously. We\'d do a dual-stream setup and raid each other afterward.',
    collab_type: 'livestream', niche_tags: ['gaming', 'comedy'],
    preferred_audience_min: 10000, preferred_audience_max: 500000,
    location: null, is_open: true,
    created_at: ago(12), updated_at: ago(12),
    profiles: profileById('mock-006'),
  },
  {
    id: 'mock-post-007', user_id: 'mock-007',
    title: 'Thrift flip challenge — $20 budget, 1 outfit',
    description: 'Let\'s do a thrift flip challenge! We each get $20 at a thrift store and have to style a complete outfit. Film the process, reveal at the end. Perfect for TikTok or YouTube Shorts. Sustainable fashion meets creativity. Who\'s in?',
    collab_type: 'video', niche_tags: ['fashion', 'lifestyle'],
    preferred_audience_min: 1000, preferred_audience_max: 50000,
    location: null, is_open: true,
    created_at: ago(6), updated_at: ago(6),
    profiles: profileById('mock-007'),
  },
  {
    id: 'mock-post-008', user_id: 'mock-008',
    title: 'Looking for creators to discuss side hustles',
    description: 'I\'m recording a series on "Side Hustles That Actually Work" and want to feature creators who\'ve built real income streams beyond brand deals — courses, merch, consulting, etc. 30-min podcast interviews, I handle all the editing.',
    collab_type: 'podcast', niche_tags: ['business', 'education'],
    preferred_audience_min: 5000, preferred_audience_max: 500000,
    location: null, is_open: true,
    created_at: ago(27), updated_at: ago(27),
    profiles: profileById('mock-008'),
  },
  {
    id: 'mock-post-009', user_id: 'mock-009',
    title: 'Art + merch giveaway collab 🎨',
    description: 'I want to team up with another creator for a joint giveaway. I\'ll contribute custom art prints and stickers. You bring your own merch or product. We both promote it and share the follower growth. Works best if our audiences are different but complementary.',
    collab_type: 'giveaway', niche_tags: ['art'],
    preferred_audience_min: 500, preferred_audience_max: 50000,
    location: null, is_open: true,
    created_at: ago(4), updated_at: ago(4),
    profiles: profileById('mock-009'),
  },
  {
    id: 'mock-post-010', user_id: 'mock-010',
    title: 'Need a creator for a music video shoot',
    description: 'I just finished producing a new Afrobeats track and I need a creative director or content creator to help plan and shoot a simple music video. Nothing fancy — think vibey street footage with good lighting and editing. I\'ll credit you everywhere.',
    collab_type: 'video', niche_tags: ['music', 'art'],
    preferred_audience_min: 1000, preferred_audience_max: 100000,
    location: 'London, UK', is_open: true,
    created_at: ago(7), updated_at: ago(7),
    profiles: profileById('mock-010'),
  },
  {
    id: 'mock-post-011', user_id: 'mock-003',
    title: 'iPhone vs Android — debate video',
    description: 'I want to film a friendly debate-style video: iPhone vs Android. I\'m team Android — need someone who genuinely loves iPhone to make the case. Should be fun, informative, and a little spicy. We\'d each post it on our channels.',
    collab_type: 'video', niche_tags: ['tech'],
    preferred_audience_min: 10000, preferred_audience_max: 500000,
    location: null, is_open: true,
    created_at: ago(48), updated_at: ago(48),
    profiles: profileById('mock-003'),
  },
  {
    id: 'mock-post-012', user_id: 'mock-002',
    title: 'Pop-up workout event in Miami',
    description: 'Planning a free outdoor workout event in Miami Beach for creators and their followers. Looking for 2-3 other fitness or wellness creators to co-host. We\'d each promote to our audience, film content during the event, and split any sponsorship.',
    collab_type: 'event', niche_tags: ['fitness', 'health', 'lifestyle'],
    preferred_audience_min: 5000, preferred_audience_max: 500000,
    location: 'Miami, FL', is_open: true,
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
    created_at: ago(1),
    collab_posts: { id: 'mock-post-001', title: 'Looking for a photographer for skincare flat-lays', collab_type: 'photo' },
    partner_a: profileById('mock-001'),
    partner_b: profileById('mock-004'),
  },
  {
    id: 'mock-match-002',
    interest_id: 'mock-int-002', post_id: 'mock-post-002',
    user_a: 'mock-002', user_b: 'mock-005',
    created_at: ago(3),
    collab_posts: { id: 'mock-post-002', title: '30-day fitness challenge — need a partner!', collab_type: 'video' },
    partner_a: profileById('mock-002'),
    partner_b: profileById('mock-005'),
  },
  {
    id: 'mock-match-003',
    interest_id: 'mock-int-006', post_id: 'mock-post-011',
    user_a: 'mock-003', user_b: 'mock-008',
    created_at: ago(22),
    collab_posts: { id: 'mock-post-011', title: 'iPhone vs Android — debate video', collab_type: 'video' },
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
      content: 'Perfect, that sounds amazing. Should I bring any of my own equipment or will the studio have everything?',
      is_read: false, created_at: ago(0.17),
    },
    unreadCount: 1,
  },
  {
    match: MOCK_MATCHES[1],
    lastMessage: {
      id: 'mock-msg-008', match_id: 'mock-match-002', sender_id: 'mock-005',
      content: 'Sounds like a plan! I\'ll draft some recipe ideas tonight and send them over. This is going to be so fun!',
      is_read: true, created_at: ago(2.3),
    },
    unreadCount: 0,
  },
  {
    match: MOCK_MATCHES[2],
    lastMessage: {
      id: 'mock-msg-012', match_id: 'mock-match-003', sender_id: 'mock-008',
      content: 'I\'ll do ecosystem integration, privacy/security, resale value, app optimization, and iMessage 😂 Let\'s make this a banger.',
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
      content: 'Hey Tomás! So excited you\'re coming to LA! When exactly are you visiting?',
      is_read: true, created_at: ago(0.75) },
    { id: 'mock-msg-002', match_id: 'mock-match-001', sender_id: 'mock-004',
      content: 'Hi Maya! I\'ll be there March 15-25. I was thinking we could do the shoot somewhere with good natural light — maybe a rooftop or near a big window?',
      is_read: true, created_at: ago(0.67) },
    { id: 'mock-msg-003', match_id: 'mock-match-001', sender_id: 'mock-001',
      content: 'Love that! I know a great studio space in DTLA with floor-to-ceiling windows. I\'ll send you the details!',
      is_read: true, created_at: ago(0.58) },
    { id: 'mock-msg-004', match_id: 'mock-match-001', sender_id: 'mock-004',
      content: 'Perfect, that sounds amazing. Should I bring any of my own equipment or will the studio have everything?',
      is_read: false, created_at: ago(0.17) },
  ],
  'mock-match-002': [
    { id: 'mock-msg-005', match_id: 'mock-match-002', sender_id: 'mock-002',
      content: 'Aisha! Welcome aboard 🔥 Love the meal prep angle. Let\'s plan this out — when do you want to start?',
      is_read: true, created_at: ago(2.8) },
    { id: 'mock-msg-006', match_id: 'mock-match-002', sender_id: 'mock-005',
      content: 'How about next Monday? That gives us the weekend to prep content ideas. I was thinking I could do "what I ate" posts alongside your workout routines.',
      is_read: true, created_at: ago(2.7) },
    { id: 'mock-msg-007', match_id: 'mock-match-002', sender_id: 'mock-002',
      content: 'Monday works great! Let\'s do a quick FaceTime this weekend to hash out the content calendar. I\'m thinking Day 1 intro, then alternating workout/meal posts.',
      is_read: true, created_at: ago(2.5) },
    { id: 'mock-msg-008', match_id: 'mock-match-002', sender_id: 'mock-005',
      content: 'Sounds like a plan! I\'ll draft some recipe ideas tonight and send them over. This is going to be so fun!',
      is_read: true, created_at: ago(2.3) },
  ],
  'mock-match-003': [
    { id: 'mock-msg-009', match_id: 'mock-match-003', sender_id: 'mock-003',
      content: 'Marcus! Great, an iPhone defender — this is going to be fun. Want to do a quick outline call this week?',
      is_read: true, created_at: ago(21) },
    { id: 'mock-msg-010', match_id: 'mock-match-003', sender_id: 'mock-008',
      content: 'Absolutely! I\'m free Thursday or Friday afternoon. Should we each prepare 5 talking points? I don\'t want it to be too scripted but some structure helps.',
      is_read: true, created_at: ago(20) },
    { id: 'mock-msg-011', match_id: 'mock-match-003', sender_id: 'mock-003',
      content: 'Friday works. 5 points each sounds good. I\'ll cover cameras, customization, app quality, value, and repairability. You?',
      is_read: true, created_at: ago(19) },
    { id: 'mock-msg-012', match_id: 'mock-match-003', sender_id: 'mock-008',
      content: 'I\'ll do ecosystem integration, privacy/security, resale value, app optimization, and iMessage 😂 Let\'s make this a banger.',
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
    title: 'New message from Tomás García',
    body: 'Should I bring any of my own equipment or will the studio have everything?',
    data: { match_id: 'mock-match-001' }, is_read: false, created_at: ago(0.17),
  },
  {
    id: 'mock-notif-002', user_id: '', type: 'new_interest',
    title: 'Kai Nakamura is interested in your collab!',
    body: 'Guest spot on my tech podcast — "Unboxed"',
    data: { post_id: 'mock-post-003' }, is_read: false, created_at: ago(2),
  },
  {
    id: 'mock-notif-003', user_id: '', type: 'new_match',
    title: 'You matched with Tomás García!',
    body: 'You can now message each other about your collab.',
    data: { match_id: 'mock-match-001' }, is_read: true, created_at: ago(1),
  },
  {
    id: 'mock-notif-004', user_id: '', type: 'interest_accepted',
    title: 'Maya Chen accepted your interest!',
    body: 'Looking for a photographer for skincare flat-lays',
    data: { post_id: 'mock-post-001' }, is_read: true, created_at: ago(1),
  },
  {
    id: 'mock-notif-005', user_id: '', type: 'new_interest',
    title: 'Emma Lindström is interested in your collab!',
    body: 'Art + merch giveaway collab 🎨',
    data: { post_id: 'mock-post-009' }, is_read: false, created_at: ago(3),
  },
  {
    id: 'mock-notif-006', user_id: '', type: 'new_match',
    title: 'You matched with Aisha Williams!',
    body: 'You can now message each other about your collab.',
    data: { match_id: 'mock-match-002' }, is_read: true, created_at: ago(3),
  },
  {
    id: 'mock-notif-007', user_id: '', type: 'new_interest',
    title: 'Daniel Okafor is interested in your collab!',
    body: 'Thrift flip challenge — $20 budget, 1 outfit',
    data: { post_id: 'mock-post-007' }, is_read: false, created_at: ago(5),
  },
  {
    id: 'mock-notif-008', user_id: '', type: 'new_message',
    title: 'New message from Marcus Johnson',
    body: 'I\'ll do ecosystem integration, privacy/security, resale value...',
    data: { match_id: 'mock-match-003' }, is_read: false, created_at: ago(18),
  },
]
