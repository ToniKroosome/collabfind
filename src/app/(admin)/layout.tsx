'use client'

import Link from 'next/link'
import { ArrowLeft, Shield } from 'lucide-react'
import { useLanguage } from '@/lib/i18n'
import { LanguageToggle } from '@/components/shared/language-toggle'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Link
              href="/feed"
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              {t('admin.backToApp')}
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-indigo-600" />
            <h1 className="text-lg font-bold">{t('admin.title')}</h1>
          </div>
          <LanguageToggle />
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 pt-20 pb-8">{children}</main>
    </div>
  )
}
