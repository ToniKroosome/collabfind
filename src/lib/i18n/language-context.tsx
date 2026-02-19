'use client'

import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'
import type { Language, Translations } from './types'
import { en } from './en'
import { th } from './th'

const translations: Record<Language, Translations> = { en, th }

interface LanguageContextType {
  language: Language
  toggleLanguage: () => void
  t: (key: keyof Translations) => string
}

const LanguageContext = createContext<LanguageContextType | null>(null)

const STORAGE_KEY = 'ix-language'

function getInitialLanguage(): Language {
  if (typeof window === 'undefined') return 'en'
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'en' || stored === 'th') return stored
  return 'en'
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage)

  useEffect(() => {
    document.documentElement.lang = language
  }, [language])

  const toggleLanguage = useCallback(() => {
    setLanguageState((prev) => {
      const next = prev === 'en' ? 'th' : 'en'
      localStorage.setItem(STORAGE_KEY, next)
      document.documentElement.lang = next
      return next
    })
  }, [])

  const t = useCallback(
    (key: keyof Translations): string => {
      return translations[language][key] || translations['en'][key] || key
    },
    [language],
  )

  const value = useMemo(
    () => ({ language, toggleLanguage, t }),
    [language, toggleLanguage, t],
  )

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
