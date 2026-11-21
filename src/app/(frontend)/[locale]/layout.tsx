import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import '@fontsource/fraunces/600.css'
import '@fontsource/ibm-plex-sans/400.css'
import '@fontsource/ibm-plex-sans/600.css'
import '@fontsource/ibm-plex-sans-arabic/400.css'
import '@fontsource/ibm-plex-sans-arabic/600.css'
import '../styles.css'
import { LOCALES, UI, dirOf, isLocale } from '@/lib/i18n'

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }))
}

export const metadata = {
  title: 'Rihla — technical test',
  robots: { index: false, follow: false },
}

export default async function LocaleLayout(props: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await props.params
  if (!isLocale(locale)) notFound()
  const t = UI[locale]

  return (
    <html lang={locale} dir={dirOf(locale)}>
      <body>
        <header className="site-header">
          <Link href={`/${locale}`} className="logo">
            {locale === 'ar' ? 'رحلة' : 'Rihla'}
          </Link>
          <nav>
            <Link href={`/${locale}/destinations`}>{t.destinations}</Link>
          </nav>
        </header>
        <main>{props.children}</main>
        <footer className="site-footer">
          {locale === 'ar' ? 'رحلة' : 'Rihla'} — {t.tagline}
        </footer>
      </body>
    </html>
  )
}
