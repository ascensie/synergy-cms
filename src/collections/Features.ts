import { CollectionConfig } from 'payload/types'

export const Features: CollectionConfig = {
  slug: 'features',
  admin: {
    useAsTitle: 'title',
    group: 'Content',
    defaultColumns: ['title', 'displayType', 'status', 'order'],
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      admin: {
        position: 'sidebar',
        description: 'Auto-generated from title',
      },
      hooks: {
        beforeValidate: [
          ({ data }) => {
            if (data?.title && !data?.slug) {
              return data.title
                .toLowerCase()
                .replace(/[^\w\s-]/g, '')
                .replace(/\s+/g, '-')
            }
            return data?.slug
          },
        ],
      },
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      localized: true,
    },
    {
      name: 'displayType',
      type: 'select',
      required: true,
      defaultValue: 'grid',
      options: [
        { label: 'Hero (Large with image)', value: 'hero' },
        { label: 'Grid (Small icon card)', value: 'grid' },
      ],
      admin: {
        description: 'How this feature should be displayed',
      },
    },
    {
      name: 'icon',
      type: 'text',
      admin: {
        description: 'Icon class name (bijv. "unicon-chart-line") - Voor grid display',
        condition: (data) => data.displayType === 'grid',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Feature image - Voor hero display',
        condition: (data) => data.displayType === 'hero',
      },
    },
    {
      name: 'imageUrl',
      type: 'text',
      admin: {
        description: 'Fallback SVG path (bijv. "/assets/images/template/feature-01.svg")',
        condition: (data) => data.displayType === 'hero',
      },
    },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'Core Features', value: 'core' },
        { label: 'Advanced', value: 'advanced' },
        { label: 'Integration', value: 'integration' },
      ],
    },
    {
      name: 'link',
      type: 'group',
      fields: [
        {
          name: 'text',
          type: 'text',
          localized: true,
          admin: {
            description: 'Link text (bijv. "Bekijk alle marketing tools")',
          },
        },
        {
          name: 'href',
          type: 'text',
          admin: {
            description: 'Link URL (bijv. "#" or "/page-features")',
          },
        },
      ],
      admin: {
        description: 'Optional link button',
      },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      required: true,
      admin: {
        description: 'Sort order (lower numbers appear first)',
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
      },
    },
    {
      name: 'content',
      type: 'blocks',
      label: 'Pagina Content',
      admin: {
        description: 'Bouw de feature detail pagina met flexibele content blokken',
      },
      blocks: [
        // Rich Text Block
        {
          slug: 'richText',
          labels: {
            singular: 'Rich Text',
            plural: 'Rich Text Blocks',
          },
          fields: [
            {
              name: 'content',
              type: 'richText',
              required: true,
            },
          ],
        },
        // Text Block with Heading
        {
          slug: 'textBlock',
          labels: {
            singular: 'Tekst Blok',
            plural: 'Tekst Blokken',
          },
          fields: [
            {
              name: 'heading',
              type: 'text',
              required: true,
            },
            {
              name: 'subtitle',
              type: 'text',
              localized: true,
              admin: {
                description: 'Optionele ondertitel',
              },
            },
            {
              name: 'headingLevel',
              type: 'select',
              defaultValue: 'h2',
              options: [
                { label: 'H2', value: 'h2' },
                { label: 'H3', value: 'h3' },
                { label: 'H4', value: 'h4' },
              ],
            },
            {
              name: 'content',
              type: 'textarea',
              required: true,
            },
            {
              name: 'backgroundColor',
              type: 'select',
              defaultValue: 'none',
              options: [
                { label: 'Geen', value: 'none' },
                { label: 'Licht (grijs)', value: 'light' },
                { label: 'Donker', value: 'dark' },
                { label: 'Navy', value: 'navy' },
              ],
            },
          ],
        },
        // Image Block
        {
          slug: 'imageBlock',
          labels: {
            singular: 'Afbeelding',
            plural: 'Afbeeldingen',
          },
          fields: [
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              required: true,
            },
            {
              name: 'caption',
              type: 'text',
            },
            {
              name: 'layout',
              type: 'select',
              defaultValue: 'medium',
              options: [
                { label: 'Klein', value: 'small' },
                { label: 'Medium', value: 'medium' },
                { label: 'Volledig breed', value: 'full' },
              ],
            },
            {
              name: 'backgroundColor',
              type: 'select',
              defaultValue: 'none',
              options: [
                { label: 'Geen', value: 'none' },
                { label: 'Licht (grijs)', value: 'light' },
                { label: 'Donker', value: 'dark' },
                { label: 'Navy', value: 'navy' },
              ],
            },
          ],
        },
        // Text with Image (side by side)
        {
          slug: 'textWithImage',
          labels: {
            singular: 'Tekst met Afbeelding',
            plural: 'Tekst met Afbeelding Blokken',
          },
          fields: [
            {
              name: 'heading',
              type: 'text',
              required: true,
            },
            {
              name: 'subtitle',
              type: 'text',
              localized: true,
              admin: {
                description: 'Optionele ondertitel',
              },
            },
            {
              name: 'content',
              type: 'richText',
              required: true,
            },
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              required: true,
            },
            {
              name: 'imagePosition',
              type: 'select',
              defaultValue: 'right',
              options: [
                { label: 'Links', value: 'left' },
                { label: 'Rechts', value: 'right' },
              ],
            },
            {
              name: 'link',
              type: 'group',
              fields: [
                {
                  name: 'text',
                  type: 'text',
                  admin: {
                    description: 'Link tekst (bijv. "Lees meer")',
                  },
                },
                {
                  name: 'href',
                  type: 'text',
                  admin: {
                    description: 'Link URL',
                  },
                },
              ],
              admin: {
                description: 'Optionele link button onder de content',
              },
            },
            {
              name: 'backgroundColor',
              type: 'select',
              defaultValue: 'none',
              options: [
                { label: 'Geen', value: 'none' },
                { label: 'Licht (grijs)', value: 'light' },
                { label: 'Donker', value: 'dark' },
                { label: 'Navy', value: 'navy' },
              ],
              admin: {
                description: 'Achtergrondkleur van het blok',
              },
            },
          ],
        },
        // Features List
        {
          slug: 'featuresList',
          labels: {
            singular: 'Features Lijst',
            plural: 'Features Lijsten',
          },
          fields: [
            {
              name: 'heading',
              type: 'text',
            },
            {
              name: 'items',
              type: 'array',
              required: true,
              minRows: 1,
              fields: [
                {
                  name: 'icon',
                  type: 'text',
                  admin: {
                    description: 'Icon class (bijv. "unicon-check")',
                  },
                },
                {
                  name: 'title',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'description',
                  type: 'textarea',
                },
              ],
            },
            {
              name: 'backgroundColor',
              type: 'select',
              defaultValue: 'none',
              options: [
                { label: 'Geen', value: 'none' },
                { label: 'Licht (grijs)', value: 'light' },
                { label: 'Donker', value: 'dark' },
                { label: 'Navy', value: 'navy' },
              ],
            },
          ],
        },
        // Quote/Testimonial Block
        {
          slug: 'quoteBlock',
          labels: {
            singular: 'Quote',
            plural: 'Quotes',
          },
          fields: [
            {
              name: 'quote',
              type: 'textarea',
              required: true,
            },
            {
              name: 'author',
              type: 'text',
            },
            {
              name: 'authorTitle',
              type: 'text',
              admin: {
                description: 'Functie of bedrijf',
              },
            },
            {
              name: 'authorImage',
              type: 'upload',
              relationTo: 'media',
            },
            {
              name: 'backgroundColor',
              type: 'select',
              defaultValue: 'light',
              options: [
                { label: 'Geen', value: 'none' },
                { label: 'Licht (grijs)', value: 'light' },
                { label: 'Donker', value: 'dark' },
                { label: 'Navy', value: 'navy' },
              ],
            },
          ],
        },
        // CTA Block
        {
          slug: 'ctaBlock',
          labels: {
            singular: 'Call to Action',
            plural: 'Call to Action Blokken',
          },
          fields: [
            {
              name: 'heading',
              type: 'text',
              required: true,
            },
            {
              name: 'description',
              type: 'textarea',
            },
            {
              name: 'primaryButton',
              type: 'group',
              fields: [
                {
                  name: 'text',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'href',
                  type: 'text',
                  required: true,
                },
              ],
            },
            {
              name: 'secondaryButton',
              type: 'group',
              fields: [
                {
                  name: 'text',
                  type: 'text',
                },
                {
                  name: 'href',
                  type: 'text',
                },
              ],
            },
            {
              name: 'backgroundColor',
              type: 'select',
              defaultValue: 'navy',
              options: [
                { label: 'Navy', value: 'navy' },
                { label: 'Light Gray', value: 'light' },
                { label: 'White', value: 'white' },
              ],
            },
          ],
        },
        // Video Embed Block
        {
          slug: 'videoBlock',
          labels: {
            singular: 'Video',
            plural: "Video's",
          },
          fields: [
            {
              name: 'videoUrl',
              type: 'text',
              required: true,
              admin: {
                description: 'YouTube of Vimeo URL',
              },
            },
            {
              name: 'caption',
              type: 'text',
            },
            {
              name: 'aspectRatio',
              type: 'select',
              defaultValue: '16-9',
              options: [
                { label: '16:9', value: '16-9' },
                { label: '4:3', value: '4-3' },
                { label: '1:1', value: '1-1' },
              ],
            },
            {
              name: 'backgroundColor',
              type: 'select',
              defaultValue: 'none',
              options: [
                { label: 'Geen', value: 'none' },
                { label: 'Licht (grijs)', value: 'light' },
                { label: 'Donker', value: 'dark' },
                { label: 'Navy', value: 'navy' },
              ],
            },
          ],
        },
        // FAQ Block
        {
          slug: 'faqBlock',
          labels: {
            singular: 'FAQ Sectie',
            plural: 'FAQ Secties',
          },
          fields: [
            {
              name: 'heading',
              type: 'text',
              required: true,
              defaultValue: 'Veelgestelde Vragen',
              localized: true,
              admin: {
                description: 'Hoofdtitel van de FAQ sectie',
              },
            },
            {
              name: 'subtitle',
              type: 'text',
              localized: true,
              admin: {
                description: 'Optionele ondertitel',
              },
            },
            {
              name: 'faqs',
              type: 'relationship',
              relationTo: 'faq',
              hasMany: true,
              required: true,
              admin: {
                description: 'Selecteer FAQ items om weer te geven (worden getoond in accordion stijl)',
              },
            },
            {
              name: 'backgroundColor',
              type: 'select',
              defaultValue: 'none',
              options: [
                { label: 'Geen', value: 'none' },
                { label: 'Licht (grijs)', value: 'light' },
                { label: 'Donker', value: 'dark' },
                { label: 'Navy', value: 'navy' },
              ],
              admin: {
                description: 'Achtergrondkleur van de FAQ sectie',
              },
            },
          ],
        },
        // Hero Block (gebaseerd op home-4 Hero)
        {
          slug: 'heroBlock',
          labels: {
            singular: 'Hero Sectie',
            plural: 'Hero Secties',
          },
          fields: [
            {
              name: 'heading',
              type: 'text',
              required: true,
            },
            {
              name: 'subtitle',
              type: 'text',
              localized: true,
              admin: {
                description: 'Optionele ondertitel onder de hoofdtitel',
              },
            },
            {
              name: 'description',
              type: 'textarea',
            },
            {
              name: 'primaryButton',
              type: 'group',
              fields: [
                {
                  name: 'text',
                  type: 'text',
                },
                {
                  name: 'href',
                  type: 'text',
                },
              ],
              admin: {
                description: 'Primary CTA button',
              },
            },
            {
              name: 'secondaryButton',
              type: 'group',
              fields: [
                {
                  name: 'text',
                  type: 'text',
                },
                {
                  name: 'href',
                  type: 'text',
                },
              ],
              admin: {
                description: 'Secondary button (optioneel)',
              },
            },
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'Hero afbeelding',
              },
            },
            {
              name: 'imagePosition',
              type: 'select',
              defaultValue: 'right',
              options: [
                { label: 'Links', value: 'left' },
                { label: 'Rechts', value: 'right' },
              ],
            },
            {
              name: 'backgroundColor',
              type: 'select',
              defaultValue: 'teal',
              options: [
                { label: 'Teal (Funnel Synergy groen)', value: 'teal' },
                { label: 'Licht (grijs)', value: 'light' },
                { label: 'Donker', value: 'dark' },
                { label: 'Navy', value: 'navy' },
              ],
              admin: {
                description: 'Achtergrondkleur van de hero sectie',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'seo',
      type: 'group',
      label: 'SEO',
      admin: {
        position: 'sidebar',
      },
      fields: [
        {
          name: 'metaTitle',
          type: 'text',
          localized: true,
          admin: {
            description: 'Overschrijft de standaard title tag',
          },
        },
        {
          name: 'metaDescription',
          type: 'textarea',
          localized: true,
          admin: {
            description: 'Meta beschrijving voor zoekmachines',
          },
        },
        {
          name: 'ogImage',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'Afbeelding voor social media sharing',
          },
        },
      ],
    },
  ],
}
