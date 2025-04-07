
import type { Locale } from '../i18n/config'

// Define the dictionary type based on the structure
export type Dictionary = {
  navigation: {
    watchAd: string
    startAutoAds: string
    stopAutoAds: string
    nextAdIn: string
  }
  buttons: {
    withdraw: string
    topEarners: string
    rules: string
    about: string
    support: string
  }
  modals: {
    topEarners: {
      title: string
      close: string
    }
    rules: {
      title: string
      close: string
    }
    about: {
      title: string
      close: string
    }
  }
  errors: {
    adFailed: string
    retry: string
  }
}

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  en: () => import('./locales/en.json').then((module) => module.default),
  bn: () => import('./locales/bn.json').then((module) => module.default),
  hi: () => import('./locales/hi.json').then((module) => module.default),
  es: () => import('./locales/es.json').then((module) => module.default),
}

export const getDictionary = async (locale: Locale): Promise<Dictionary> => {
  try {
    return await (dictionaries[locale] ?? dictionaries.en)()
  } catch (error) {
    return await dictionaries.en()
  }
}
