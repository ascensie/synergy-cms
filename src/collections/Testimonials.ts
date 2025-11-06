import { CollectionConfig } from 'payload/types'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'position', 'rating', 'featured'],
    group: 'Content',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      name: 'quote',
      type: 'textarea',
      required: true,
      localized: true,
      admin: {
        description: 'De testimonial quote',
      },
    },
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'position',
      type: 'text',
      required: true,
      localized: true,
      admin: {
        description: 'Job title en locatie (bijv. "Business Coach, Groningen")',
      },
    },
    {
      name: 'company',
      type: 'text',
      admin: {
        description: 'Bedrijfsnaam (optioneel)',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'Profielfoto van de persoon',
      },
    },
    {
      name: 'brandImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Logo van het bedrijf (optioneel)',
      },
    },
    {
      name: 'rating',
      type: 'number',
      required: true,
      defaultValue: 5,
      min: 1,
      max: 5,
      admin: {
        step: 1,
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Toon op homepage?',
      },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Volgorde op pagina (lager = eerder)',
      },
    },
  ],
}
