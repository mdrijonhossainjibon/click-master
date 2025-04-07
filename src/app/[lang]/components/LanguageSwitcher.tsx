'use client'

import { usePathname, useRouter } from 'next/navigation'
import { locales } from '../../i18n/config'

const languageNames = {
  en: 'English',
  bn: 'বাংলা',
  hi: 'हिंदी',
  es: 'Español'
}

export default function LanguageSwitcher() {
  const pathname = usePathname()
  const router = useRouter()

  const currentLocale = pathname.split('/')[1]

  const handleLanguageChange = (newLocale: string) => {
    // Replace the locale segment of the URL
    const newPath = pathname.replace(`/${currentLocale}`, `/${newLocale}`)
    router.push(newPath)
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <select
        value={currentLocale}
        onChange={(e) => handleLanguageChange(e.target.value)}
        className="bg-gray-800 text-white border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
      >
        {locales.map((locale) => (
          <option key={locale} value={locale}>
            {languageNames[locale]}
          </option>
        ))}
      </select>
    </div>
  )
}
