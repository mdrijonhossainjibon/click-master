import type { Locale } from '@/i18n/settings';

const dictionaries = {
  en: () => import('./en.json').then(module => module.default),
  bn: () => import('./bn.json').then(module => module.default),
};

export const getDictionary = async (locale: Locale) => {
  try {
    return await dictionaries[locale]();
  } catch (error) {
    return await dictionaries.en();
  }
};
