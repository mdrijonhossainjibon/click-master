export const locales = ['en', 'bn', 'hi', 'es'] as const
export const defaultLocale = 'en'

export type Locale = typeof locales[number]

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale)
}
