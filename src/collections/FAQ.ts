import { CollectionConfig } from 'payload'

export const FAQ: CollectionConfig = {
  slug: 'faq',
  admin: {
    useAsTitle: 'question',
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
      name: 'question',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'answer',
      type: 'textarea',
      required: true,
      localized: true,
    },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'General', value: 'general' },
        { label: 'Pricing', value: 'pricing' },
        { label: 'Technical', value: 'technical' },
        { label: 'Support', value: 'support' },
      ],
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
    },
  ],
}
