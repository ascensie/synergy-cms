import { CollectionConfig } from 'payload/types'

export const Brands: CollectionConfig = {
  slug: 'brands',
  admin: {
    useAsTitle: 'name',
    group: 'Content',
    defaultColumns: ['name', 'status', 'order'],
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      localized: true,
      admin: {
        description: 'Naam van het brand (bijv. "Polymath", "Segment")',
      },
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'Logo afbeelding van het brand (light mode)',
      },
    },
    {
      name: 'logoAlt',
      type: 'text',
      admin: {
        description: 'Alt text voor toegankelijkheid (optioneel, gebruikt name als fallback)',
      },
    },
    {
      name: 'darkModeLogo',
      type: 'upload',
      relationTo: 'media',
      required: false,
      admin: {
        description: 'Alternatief logo voor dark mode (optioneel)',
      },
    },
    {
      name: 'url',
      type: 'text',
      admin: {
        description: 'Link naar brand website (optioneel)',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'published',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
      admin: {
        position: 'sidebar',
        description: 'Publicatiestatus',
      },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      required: true,
      admin: {
        description: 'Sorteervolgorde (lager = eerder weergegeven)',
      },
    },
  ],
}
