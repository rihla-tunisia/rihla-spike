export const LOCALES = ['fr', 'en', 'ar'] as const
export type Locale = (typeof LOCALES)[number]

export const isLocale = (v: string): v is Locale => (LOCALES as readonly string[]).includes(v)

export const dirOf = (l: Locale) => (l === 'ar' ? 'rtl' : 'ltr')

export const LOCALE_LABEL: Record<Locale, string> = { fr: 'FR', en: 'EN', ar: 'ع' }

// Interface text (buttons, labels) — separate from editorial content
export const UI: Record<Locale, Record<string, string>> = {
  fr: {
    home: 'Accueil',
    destinations: 'Destinations',
    whyGo: 'Pourquoi y aller',
    atAGlance: "En un coup d'œil",
    region: 'Région',
    phone: 'Téléphone',
    north: 'Nord',
    centre: 'Centre',
    south: 'Sud',
    notAvailable: "Cette page n'est pas encore disponible en français.",
    tagline: 'Découvrez la vraie Tunisie',
  },
  en: {
    home: 'Home',
    destinations: 'Destinations',
    whyGo: 'Why go',
    atAGlance: 'At a glance',
    region: 'Region',
    phone: 'Phone',
    north: 'North',
    centre: 'Centre',
    south: 'South',
    notAvailable: 'This page is not available in English yet.',
    tagline: 'Discover the real Tunisia',
  },
  ar: {
    home: 'الرئيسية',
    destinations: 'الوجهات',
    whyGo: 'لماذا تزورها',
    atAGlance: 'لمحة سريعة',
    region: 'المنطقة',
    phone: 'الهاتف',
    north: 'الشمال',
    centre: 'الوسط',
    south: 'الجنوب',
    notAvailable: 'هذه الصفحة غير متوفرة بالعربية بعد.',
    tagline: 'اكتشف تونس الحقيقية',
  },
}

/** Arabic search normalisation: ignore diacritics and unify letter variants */
export function normalizeArabic(input: string): string {
  return input
    .normalize('NFKC')
    .replace(/[ً-ٰٟـ]/g, '') // tashkil + tatweel
    .replace(/[إأآٱ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/ؤ/g, 'و')
    .replace(/ئ/g, 'ي')
    .toLowerCase()
    .trim()
}
