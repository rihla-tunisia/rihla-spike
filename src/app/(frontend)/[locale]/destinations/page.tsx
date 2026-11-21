import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import { UI, isLocale, normalizeArabic } from '@/lib/i18n'
import { notFound } from 'next/navigation'

export default async function DestinationsList(props: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ q?: string }>
}) {
  const { locale } = await props.params
  const { q } = await props.searchParams
  if (!isLocale(locale)) notFound()
  const t = UI[locale]
  const payload = await getPayload({ config })
  const res = await payload.find({ collection: 'destinations', locale, limit: 100, depth: 1 })

  // Only show destinations that exist in this language (no silent fallback)
  let docs = res.docs.filter((d) => d.name && d.slug)
  if (q) {
    const needle = normalizeArabic(q)
    docs = docs.filter((d) => normalizeArabic(`${d.name} ${d.tagline ?? ''}`).includes(needle))
  }

  return (
    <div className="container">
      <h1>{t.destinations}</h1>
      <form className="search">
        <input name="q" defaultValue={q} placeholder="🔍" aria-label="search" />
      </form>
      <ul className="cards">
        {docs.map((d) => (
          <li key={d.id}>
            <Link href={`/${locale}/destinations/${d.slug}`}>
              <strong>{d.name}</strong>
              <span>{d.tagline}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
