import type { CollectionConfig } from 'payload'
import { revalidatePath } from 'next/cache'

const LOCALES = ['fr', 'en', 'ar'] as const

export const Destinations: CollectionConfig = {
  slug: 'destinations',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'region', 'type', 'updatedAt'],
  },
  access: {
    read: () => true,
  },
  versions: {
    drafts: true,
  },
  hooks: {
    // When a destination is published or edited, rebuild its page in every language
    afterChange: [
      async ({ doc, req }) => {
        // Look up the slug in every language, then refresh each exact page + the lists
        const all = (await req.payload.findByID({
          collection: 'destinations',
          id: doc.id,
          locale: 'all',
          depth: 0,
          req,
        })) as unknown as { slug?: Record<string, string> }
        for (const locale of LOCALES) {
          const slug = all.slug?.[locale]
          if (slug) revalidatePath(`/${locale}/destinations/${slug}`)
          revalidatePath(`/${locale}/destinations`)
        }
        return doc
      },
    ],
  },
  fields: [
    { name: 'name', type: 'text', required: true, localized: true },
    { name: 'slug', type: 'text', required: true, localized: true, index: true },
    {
      name: 'region',
      type: 'select',
      required: true,
      options: [
        { label: 'North', value: 'north' },
        { label: 'Centre', value: 'centre' },
        { label: 'South', value: 'south' },
      ],
    },
    {
      name: 'type',
      type: 'select',
      options: [
        { label: 'City', value: 'city' },
        { label: 'Island', value: 'island' },
        { label: 'Oasis', value: 'oasis' },
        { label: 'Archaeological site', value: 'archaeological_site' },
      ],
    },
    { name: 'tagline', type: 'text', localized: true },
    { name: 'intro', type: 'richText', localized: true },
    {
      name: 'whyGo',
      type: 'array',
      localized: true,
      fields: [{ name: 'item', type: 'text' }],
    },
    { name: 'heroImage', type: 'upload', relationTo: 'media' },
    {
      type: 'row',
      fields: [
        { name: 'latitude', type: 'number' },
        { name: 'longitude', type: 'number' },
      ],
    },
    {
      name: 'contactPhone',
      type: 'text',
      admin: { description: 'Shared across languages (numbers are never mirrored)' },
    },
  ],
}
