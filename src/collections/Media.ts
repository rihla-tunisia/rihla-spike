import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'credit',
      type: 'text',
    },
  ],
  upload: {
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/avif'],
    focalPoint: true,
    imageSizes: [
      { name: 'card', width: 600, height: 400, position: 'centre' },
      { name: 'hero', width: 1600, height: 900, position: 'centre' },
      { name: 'mobile', width: 800, height: 1000, position: 'centre' },
    ],
    formatOptions: { format: 'webp', options: { quality: 80 } },
  },
}
