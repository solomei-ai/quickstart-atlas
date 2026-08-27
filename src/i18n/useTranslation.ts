import { createContext, useContext } from 'react'
import en from './en.json'

// English is the only locale for now; its shape defines the message contract.
export type Messages = typeof en
export type Locale = 'en'

export const messages: Record<Locale, Messages> = { en }

export interface I18nContextValue {
  locale: Locale
  messages: Messages
}

export const I18nContext = createContext<I18nContextValue | null>(null)

// Resolves a dotted key path (e.g. 'promptBar.placeholder') against the
// active locale's messages.
type Path<T> = {
  [K in keyof T & string]: T[K] extends object
    ? `${K}.${Path<T[K]>}`
    : K
}[keyof T & string]

export type MessageKey = Path<Messages>

export function useTranslation() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useTranslation must be used within an I18nProvider')

  const t = (key: MessageKey): string => {
    const value = key
      .split('.')
      .reduce<unknown>((acc, part) => (acc as Record<string, unknown>)?.[part], ctx.messages)
    return typeof value === 'string' ? value : key
  }

  return { t, locale: ctx.locale }
}
