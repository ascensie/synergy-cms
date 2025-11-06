import { CollectionConfig } from 'payload'

export const Integrations: CollectionConfig = {
  slug: 'integrations',
  admin: {
    useAsTitle: 'name',
    group: 'Content',
    defaultColumns: ['name', 'category', 'status', 'order'],
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
        description: 'Naam van de integratie (bijv. "Google Calendar")',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      localized: true,
      admin: {
        description: 'Korte beschrijving van wat de integratie doet',
      },
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      required: false,
      admin: {
        description: 'Logo van de integratie (optioneel - gebruik imageUrl als fallback)',
      },
    },
    {
      name: 'imageUrl',
      type: 'text',
      admin: {
        description: 'Fallback: directe URL naar afbeelding (bijv. "/assets/images/integrations/...")',
      },
    },
    {
      name: 'imageAlt',
      type: 'text',
      admin: {
        description: 'Alt text voor de afbeelding',
      },
    },
    {
      name: 'url',
      type: 'text',
      admin: {
        description: 'Link naar de integratie website',
      },
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Advertentieplatform', value: 'Advertentieplatform' },
        { label: 'Agenda', value: 'Agenda' },
        { label: 'Automatiseringsplatform', value: 'Automatiseringsplatform' },
        { label: 'Berichten', value: 'Berichten' },
        { label: 'Betaalprovider', value: 'Betaalprovider' },
        { label: 'E-mail', value: 'E-mail' },
        { label: 'Projectmanagement', value: 'Projectmanagement' },
        { label: 'Socialmediaplatform', value: 'Socialmediaplatform' },
        { label: 'Videovergaderen', value: 'Videovergaderen' },
        { label: 'Webshops', value: 'Webshops' },
      ],
      admin: {
        description: 'Categorie van de integratie',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Toon deze integratie als featured',
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
        description: 'Sorteervolgorde (lager = eerder)',
      },
    },
  ],
}
