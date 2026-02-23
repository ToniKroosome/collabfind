export { en } from './en'
export { th } from './th'
export type { Translations, Language } from './types'
export { LanguageProvider, useLanguage } from './language-context'

import type { Translations } from './types'

type TranslateFn = (key: keyof Translations) => string

export function getCollabTypeLabel(t: TranslateFn, value: string): string {
  const key = `collabType.${value}` as keyof Translations
  return t(key)
}

export function getNicheLabel(t: TranslateFn, value: string): string {
  const key = `niche.${value}` as keyof Translations
  return t(key)
}

export function getDeliverableTypeLabel(t: TranslateFn, value: string): string {
  const key = `deliverable.${value}` as keyof Translations
  return t(key)
}

export function getTitleTemplateLabel(t: TranslateFn, value: string): string {
  const key = `titleTemplate.${value}` as keyof Translations
  return t(key)
}
