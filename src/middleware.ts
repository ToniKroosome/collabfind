import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const pathname = request.nextUrl.pathname

  // Protected paths that require authentication
  const protectedPaths = ['/matches', '/messages', '/notifications', '/admin']
  const isProtected =
    protectedPaths.some((p) => pathname.startsWith(p)) ||
    pathname === '/post/new' ||
    pathname === '/profile'

  const isAuthPage = pathname === '/login' || pathname === '/signup'
  const isAdminPage = pathname.startsWith('/admin')

  // Only call getUser() when we actually need to check auth
  // (protected routes or auth pages that should redirect logged-in users)
  if (isProtected || isAuthPage) {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (isProtected && !user) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }

    if (isAuthPage && user) {
      const url = request.nextUrl.clone()
      url.pathname = '/feed'
      return NextResponse.redirect(url)
    }

    // Admin route: check is_admin on profile
    if (isAdminPage && user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single()

      if (!profile?.is_admin) {
        const url = request.nextUrl.clone()
        url.pathname = '/feed'
        return NextResponse.redirect(url)
      }
    }
  }

  // Visitor tracking cookie
  let visitorId = request.cookies.get('cf_visitor')?.value
  if (!visitorId) {
    visitorId = crypto.randomUUID()
    supabaseResponse.cookies.set('cf_visitor', visitorId, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365, // 1 year
      path: '/',
    })
  }

  // Log page view (non-blocking, skip api/admin/auth routes)
  const isTrackable =
    !pathname.startsWith('/api') &&
    !pathname.startsWith('/admin') &&
    !pathname.startsWith('/auth')

  if (isTrackable) {
    const userAgent = request.headers.get('user-agent') || ''
    const isBot = /bot|crawl|spider|slurp|bingpreview/i.test(userAgent)
    if (!isBot) {
      supabase.from('page_views').insert({
        path: pathname,
        visitor_id: visitorId,
      }).then() // fire and forget
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|icons|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
