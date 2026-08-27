import { useState, type ReactNode } from 'react'
import { I18nContext, messages, type Locale } from './useTranslation'

const DEFAULT_LOCALE: Locale = 'en'

export function I18nProvider({ children }: { children: ReactNode }) {
  // Only English exists for now; state leaves room to add locales later.
  const [locale] = useState<Locale>(DEFAULT_LOCALE)

  return (
    <I18nContext value={{ locale, messages: messages[locale] }}>
      {children}
    </I18nContext>
  )
}
