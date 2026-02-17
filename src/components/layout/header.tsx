'use client'

import Link from 'next/link'
import { Bell } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import { useNotifications } from '@/hooks/use-notifications'
import { Button } from '@/components/ui/button'
import { LanguageToggle } from '@/components/shared/language-toggle'
import { useLanguage } from '@/lib/i18n'

export function Header() {
  const { user, loading } = useAuth()
  const { unreadCount } = useNotifications(user?.id)
  const { t } = useLanguage()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-lg items-center justify-between px-4">
        <Link href="/feed" className="text-lg font-bold text-indigo-600">
          IntrovertxCollab
        </Link>
        <div className="flex items-center gap-1">
          <LanguageToggle />
          {user ? (
            <Link href="/notifications">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-medium text-white">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </Button>
            </Link>
          ) : !loading ? (
            <Link href="/login">
              <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">
                {t('auth.signIn')}
              </Button>
            </Link>
          ) : null}
        </div>
      </div>
    </header>
  )
}
