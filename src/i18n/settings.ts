export const languages = ['en', 'bn', 'hi', 'es'] as const;
export type Language = typeof languages[number];

export const defaultLanguage = 'en' as const;

export const languageNames = {
  en: 'English',
  bn: 'বাংলা',
  hi: 'हिंदी',
  es: 'Español',
} as const;
