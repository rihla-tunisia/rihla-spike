import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import { RichText } from '@payloadcms/richtext-lexical/react'
import config from '@payload-config'
import { LOCALES, LOCALE_LABEL, UI, isLocale, type Locale } from '@/lib/i18n'
import type { Media } from '@/payload-types'

// Pages are built once and cached; publishing in the admin triggers a rebuild
export const revalidate = false
export const dynamicParams = true

export async function generateStaticParams() {
  return []
}

export default async function DestinationPage(props: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await props.params
  if (!isLocale(locale)) notFound()
  const t = UI[locale]
  const payload = await getPayload({ config })

  const found = await payload.find({
    collection: 'destinations',
    locale,
    where: { slug: { equals: decodeURIComponent(slug) } },
    limit: 1,
    depth: 1,
  })
  const doc = found.docs[0]
  if (!doc || !doc.name) notFound()

  // Same document in all languages → language switcher goes to the equivalent page
  const all = (await payload.findByID({
    collection: 'destinations',
    id: doc.id,
    locale: 'all',
    depth: 0,
  })) as unknown as { slug: Partial<Record<Locale, string>> }

  const hero = doc.heroImage as Media | null | undefined
  const heroUrl = hero?.sizes?.hero?.url ?? hero?.url

  return (
    <article>
      <div className="lang-switch" aria-label="language">
        {LOCALES.map((l) =>
          all.slug?.[l] ? (
            <Link
              key={l}
              href={`/${l}/destinations/${all.slug[l]}`}
              aria-current={l === locale ? 'page' : undefined}
              hrefLang={l}
            >
              {LOCALE_LABEL[l]}
            </Link>
          ) : (
            <span key={l} className="disabled" title={UI[l].notAvailable}>
              {LOCALE_LABEL[l]}
            </span>
          ),
        )}
      </div>

      <nav className="breadcrumbs container">
        <Link href={`/${locale}`}>{t.home}</Link>
        <span className="sep" aria-hidden>›</span>
        <Link href={`/${locale}/destinations`}>{t.destinations}</Link>
        <span className="sep" aria-hidden>›</span>
        <span>{doc.name}</span>
      </nav>

      <header className="hero">
        {heroUrl && <img src={heroUrl} alt={hero?.alt ?? ''} />}
        <div className="hero-text">
          <p className="eyebrow">{t[doc.region]}</p>
          <h1>{doc.name}</h1>
          {doc.tagline && <p className="tagline">{doc.tagline}</p>}
        </div>
        {hero?.credit && <small className="credit">{hero.credit}</small>}
      </header>

      <div className="container layout">
        <div className="body">
          {doc.intro && <RichText data={doc.intro} />}
          {doc.whyGo && doc.whyGo.length > 0 && (
            <section>
              <h2>{t.whyGo}</h2>
              <ul className="why">
                {doc.whyGo.map((w) => (
                  <li key={w.id}>{w.item}</li>
                ))}
              </ul>
            </section>
          )}
        </div>
        <aside className="glance">
          <h3>{t.atAGlance}</h3>
          <dl>
            <dt>{t.region}</dt>
            <dd>{t[doc.region]}</dd>
            {doc.contactPhone && (
              <>
                <dt>{t.phone}</dt>
                <dd>
                  <bdi dir="ltr">{doc.contactPhone}</bdi>
                </dd>
              </>
            )}
            <dt>GPS</dt>
            <dd>
              <bdi dir="ltr">
                {doc.latitude}, {doc.longitude}
              </bdi>
            </dd>
          </dl>
        </aside>
      </div>
    </article>
  )
}
