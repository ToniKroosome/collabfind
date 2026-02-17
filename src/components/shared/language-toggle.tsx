'use client'

import { useLanguage } from '@/lib/i18n'

export function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage()

  return (
    <button
      onClick={toggleLanguage}
      className="flex h-8 w-8 items-center justify-center rounded-full border text-xs font-bold transition-colors hover:bg-muted"
      aria-label={language === 'en' ? 'เปลี่ยนเป็นภาษาไทย' : 'Switch to English'}
    >
      {language === 'en' ? 'TH' : 'EN'}
    </button>
  )
}
