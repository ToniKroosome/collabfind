'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, PlusCircle, Heart, MessageCircle, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/lib/i18n'
import type { Translations } from '@/lib/i18n'

const NAV_ITEMS: { href: string; icon: typeof Home; labelKey: keyof Translations }[] = [
  { href: '/feed', icon: Home, labelKey: 'nav.feed' },
  { href: '/post/new', icon: PlusCircle, labelKey: 'nav.post' },
  { href: '/matches', icon: Heart, labelKey: 'nav.matches' },
  { href: '/messages', icon: MessageCircle, labelKey: 'nav.messages' },
  { href: '/profile', icon: User, labelKey: 'nav.profile' },
]

export function Navbar() {
  const pathname = usePathname()
  const { t } = useLanguage()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex max-w-lg items-center justify-around px-2 pb-[env(safe-area-inset-bottom)]">
        {NAV_ITEMS.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center gap-0.5 px-3 py-2 text-xs transition-colors',
                isActive
                  ? 'text-indigo-600'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{t(item.labelKey)}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
