import { buildConfig } from 'payload/config'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { viteBundler } from '@payloadcms/bundler-vite'
import { slateEditor } from '@payloadcms/richtext-slate'
import path from 'path'

// Collections
import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { BlogPosts } from './collections/BlogPosts'
import { Products } from './collections/Products'
import { TeamMembers } from './collections/TeamMembers'
import { Testimonials } from './collections/Testimonials'
import { Features } from './collections/Features'
import { PricingPlans } from './collections/PricingPlans'
import { FAQ } from './collections/FAQ'
import { Services } from './collections/Services'
import { Integrations } from './collections/Integrations'
import { Brands } from './collections/Brands'

// Admin UI Components
import { Logo } from './components/admin/Logo'
import { Icon } from './components/admin/Icon'

export default buildConfig({
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL || `http://localhost:${process.env.PAYLOAD_PORT || 7070}`,
  admin: {
    user: Users.slug,
    bundler: viteBundler(),
    meta: {
      titleSuffix: '- Funnel Synergy',
      favicon: '/assets/favicon.jpg',
      ogImage: '/assets/Funnel-synergy-logo-black.png',
    },
    css: path.resolve(__dirname, './styles/admin.css'),
    components: {
      graphics: {
        Logo,
        Icon,
      },
    },
  },
  editor: slateEditor({}),
  localization: {
    locales: ['nl', 'en'],
    defaultLocale: 'nl',
    fallback: true,
  },
  collections: [
    Users,
    Media,
    BlogPosts,
    Products,
    TeamMembers,
    Testimonials,
    Features,
    PricingPlans,
    FAQ,
    Services,
    Integrations,
    Brands,
  ],
  typescript: {
    outputFile: path.resolve(__dirname, '../payload-types.ts'),
  },
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, '../generated-schema.graphql'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || 'mongodb://localhost:27017/synergy-cms',
  }),
  cors: [
    process.env.NEXT_PUBLIC_URL || 'http://localhost:3000',
  ],
  csrf: [
    process.env.NEXT_PUBLIC_URL || 'http://localhost:3000',
  ],
})
