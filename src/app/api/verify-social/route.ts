import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

type Platform = 'instagram' | 'tiktok' | 'youtube' | 'twitter' | 'facebook'

function extractUsername(platform: Platform, url: string): string | null {
  try {
    const parsed = new URL(url)
    const path = parsed.pathname.replace(/\/$/, '')
    const segments = path.split('/').filter(Boolean)

    switch (platform) {
      case 'instagram':
        return segments[0] || null
      case 'tiktok':
        return segments[0]?.replace('@', '') || null
      case 'youtube':
        if (segments[0] === 'channel') return segments[1] || null
        return segments[0]?.replace('@', '') || null
      case 'twitter':
        return segments[0] || null
      case 'facebook':
        if (segments[0] === 'profile.php') return parsed.searchParams.get('id')
        return segments[0] || null
      default:
        return null
    }
  } catch {
    return null
  }
}

function getProfileUrl(platform: Platform, username: string): string {
  switch (platform) {
    case 'instagram':
      return `https://www.instagram.com/${username}/`
    case 'tiktok':
      return `https://www.tiktok.com/@${username}`
    case 'youtube':
      return username.startsWith('UC')
        ? `https://www.youtube.com/channel/${username}`
        : `https://www.youtube.com/@${username}`
    case 'twitter':
      return `https://x.com/${username}`
    case 'facebook':
      return `https://www.facebook.com/${username}`
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function verifyYouTube(username: string, code: string, userId: string, verificationId: string, supabase: any) {
  const apiKey = process.env.YOUTUBE_API_KEY
  if (!apiKey) {
    return NextResponse.json({
      error: 'failed',
      message: 'YouTube verification is not configured. Please contact the admin.',
    }, { status: 200 })
  }

  try {
    // Determine if it's a channel ID (starts with UC) or a handle
    const isChannelId = username.startsWith('UC')
    const params = new URLSearchParams({
      part: 'snippet',
      key: apiKey,
    })

    if (isChannelId) {
      params.set('id', username)
    } else {
      params.set('forHandle', username)
    }

    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?${params}`,
      { signal: AbortSignal.timeout(10000) }
    )

    if (!response.ok) {
      return NextResponse.json({
        error: 'failed',
        message: 'Could not reach YouTube API. Please try again.',
      }, { status: 200 })
    }

    const data = await response.json()
    const channel = data.items?.[0]

    if (!channel) {
      return NextResponse.json({
        error: 'failed',
        message: 'YouTube channel not found. Check your URL.',
      }, { status: 200 })
    }

    const description = channel.snippet?.description || ''

    if (description.includes(code)) {
      await supabase
        .from('profiles')
        .update({ youtube_verified: true })
        .eq('id', userId)

      await supabase
        .from('social_verifications')
        .delete()
        .eq('id', verificationId)

      return NextResponse.json({ success: true })
    }

    return NextResponse.json({
      error: 'failed',
      message: 'Code not found in your YouTube channel description.',
    }, { status: 200 })
  } catch {
    return NextResponse.json({
      error: 'failed',
      message: 'Could not reach YouTube. Please try again.',
    }, { status: 200 })
  }
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { platform, action } = await request.json()

  if (!['instagram', 'tiktok', 'youtube', 'twitter', 'facebook'].includes(platform)) {
    return NextResponse.json({ error: 'Invalid platform' }, { status: 400 })
  }

  // Generate a new verification code
  if (action === 'generate') {
    const code = `ix-${Math.random().toString(36).substring(2, 8)}`

    const { error } = await supabase
      .from('social_verifications')
      .upsert(
        {
          user_id: user.id,
          platform,
          code,
          created_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        },
        { onConflict: 'user_id,platform' }
      )

    if (error) {
      return NextResponse.json({ error: 'Failed to generate code' }, { status: 500 })
    }

    return NextResponse.json({ code })
  }

  // Check verification
  if (action === 'check') {
    // Get pending verification
    const { data: verification } = await supabase
      .from('social_verifications')
      .select('*')
      .eq('user_id', user.id)
      .eq('platform', platform)
      .single()

    if (!verification) {
      return NextResponse.json({ error: 'No pending verification' }, { status: 404 })
    }

    if (new Date(verification.expires_at) < new Date()) {
      await supabase
        .from('social_verifications')
        .delete()
        .eq('id', verification.id)
      return NextResponse.json({ error: 'expired' }, { status: 410 })
    }

    // Get the user's social URL
    const { data: profile } = await supabase
      .from('profiles')
      .select(`${platform}_url`)
      .eq('id', user.id)
      .single()

    const url = profile?.[`${platform}_url` as keyof typeof profile] as string | null
    if (!url) {
      return NextResponse.json({ error: 'No URL set for this platform' }, { status: 400 })
    }

    const username = extractUsername(platform as Platform, url)
    if (!username) {
      return NextResponse.json({ error: 'Could not extract username from URL' }, { status: 400 })
    }

    // YouTube: use Data API for reliable description check
    if (platform === 'youtube') {
      return await verifyYouTube(username, verification.code, user.id, verification.id, supabase)
    }

    // Other platforms: fetch the public profile page
    const profileUrl = getProfileUrl(platform as Platform, username)

    try {
      const response = await fetch(profileUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; IntrovertxCollab/1.0)',
          'Accept': 'text/html',
          'Accept-Language': 'en-US,en;q=0.9',
        },
        signal: AbortSignal.timeout(10000),
      })

      if (!response.ok) {
        return NextResponse.json({
          error: 'failed',
          message: 'Could not fetch profile page. Make sure your profile is public.',
        }, { status: 200 })
      }

      const html = await response.text()

      // Check if the verification code exists in the page content
      if (html.includes(verification.code)) {
        // Mark as verified
        await supabase
          .from('profiles')
          .update({ [`${platform}_verified`]: true })
          .eq('id', user.id)

        // Delete the verification record
        await supabase
          .from('social_verifications')
          .delete()
          .eq('id', verification.id)

        return NextResponse.json({ success: true })
      }

      return NextResponse.json({
        error: 'failed',
        message: 'Code not found in your profile bio.',
      }, { status: 200 })
    } catch {
      return NextResponse.json({
        error: 'failed',
        message: 'Could not reach the platform. Please try again.',
      }, { status: 200 })
    }
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
}
