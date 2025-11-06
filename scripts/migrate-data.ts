/**
 * Data Migratie Script
 *
 * Migreert data van de bestaande JavaScript data files naar Payload CMS
 *
 * Gebruik: npm run migrate:data
 */

import payload from 'payload'
import path from 'path'

// Import data from Next.js project
const DATA_DIR = path.resolve(__dirname, '../../synergy-website/data')

// Helper function to dynamically import data files
async function importData(filename: string) {
  try {
    const module = await import(path.join(DATA_DIR, filename))
    return module
  } catch (error) {
    console.warn(`⚠️  Could not import ${filename}:`, error)
    return null
  }
}

async function migrate() {
  // Initialize Payload
  console.log('🔧 Initializing Payload...')
  await payload.init({
    secret: process.env.PAYLOAD_SECRET || 'your-secret-key-here',
    local: true, // Bypass Express
  })

  console.log('✅ Payload initialized\n')
  console.log('🚀 Starting data migration...\n')

  try {
    // ============================================
    // Migrate Team Members
    // ============================================
    console.log('👥 Migrating team members...')
    const teamData = await importData('team.js')

    if (teamData?.teamMembers) {
      let count = 0
      for (const member of teamData.teamMembers) {
        try {
          await payload.create({
            collection: 'team-members',
            data: {
              name: member.name,
              position: member.position,
              bio: member.bio || '',
              order: member.id || count,
              // Note: Images need to be handled separately via migrate-images.ts
            },
          })
          count++
          console.log(`  ✓ ${member.name}`)
        } catch (error) {
          console.error(`  ✗ Error creating ${member.name}:`, error)
        }
      }
      console.log(`✅ Migrated ${count} team members\n`)
    }

    // ============================================
    // Migrate Blog Posts
    // ============================================
    console.log('📝 Migrating blog posts...')
    const blogsData = await importData('blogs.js')

    if (blogsData?.posts) {
      let count = 0
      for (const post of blogsData.posts) {
        try {
          // Generate slug from title
          const slug = post.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')

          await payload.create({
            collection: 'blog-posts',
            data: {
              title: post.title,
              slug,
              excerpt: post.excerpt,
              content: post.excerpt, // TODO: Add full content
              category: post.category?.toLowerCase() || 'general',
              status: 'published',
              publishedAt: new Date().toISOString(),
              featured: false,
              // Note: Author and image need to be set after migration
            },
          })
          count++
          console.log(`  ✓ ${post.title}`)
        } catch (error) {
          console.error(`  ✗ Error creating ${post.title}:`, error)
        }
      }
      console.log(`✅ Migrated ${count} blog posts\n`)
    }

    // ============================================
    // Migrate Products
    // ============================================
    console.log('🛍️  Migrating products...')
    const productsData = await importData('products.js')

    if (productsData?.products) {
      let count = 0
      for (const product of productsData.products) {
        try {
          const slug = product.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')

          await payload.create({
            collection: 'products',
            data: {
              name: product.name,
              slug,
              description: '',
              images: [], // TODO: Add after image migration
              pricing: {
                price: product.price,
                oldPrice: product.oldPrice || undefined,
                discount: product.discount || undefined,
              },
              rating: product.rating || 5,
              inventory: 100,
              status: 'active',
            },
          })
          count++
          console.log(`  ✓ ${product.name}`)
        } catch (error) {
          console.error(`  ✗ Error creating ${product.name}:`, error)
        }
      }
      console.log(`✅ Migrated ${count} products\n`)
    }

    // ============================================
    // Migrate Testimonials
    // ============================================
    console.log('💬 Migrating testimonials...')
    const testimonialsData = await importData('testimonials.js')

    if (testimonialsData?.testimonials) {
      let count = 0
      for (const testimonial of testimonialsData.testimonials) {
        try {
          await payload.create({
            collection: 'testimonials',
            data: {
              quote: testimonial.quote,
              name: testimonial.name,
              position: testimonial.position,
              company: '',
              rating: 5,
              featured: true,
              order: count,
            },
          })
          count++
          console.log(`  ✓ ${testimonial.name}`)
        } catch (error) {
          console.error(`  ✗ Error creating ${testimonial.name}:`, error)
        }
      }
      console.log(`✅ Migrated ${count} testimonials\n`)
    }

    // ============================================
    // Migrate Features
    // ============================================
    console.log('⚡ Migrating features...')
    const featuresData = await importData('features.js')

    if (featuresData?.allFeatures || featuresData?.features) {
      const features = featuresData.allFeatures || featuresData.features
      let count = 0

      for (const feature of features) {
        try {
          await payload.create({
            collection: 'features',
            data: {
              title: feature.title || feature.name,
              description: feature.description || feature.desc,
              icon: feature.icon || '',
              category: 'core',
              order: count,
            },
          })
          count++
          console.log(`  ✓ ${feature.title || feature.name}`)
        } catch (error) {
          console.error(`  ✗ Error creating feature:`, error)
        }
      }
      console.log(`✅ Migrated ${count} features\n`)
    }

    // ============================================
    // Migrate FAQ
    // ============================================
    console.log('❓ Migrating FAQ...')
    const faqData = await importData('faq.js')

    if (faqData?.faqItems || faqData?.faqs) {
      const faqs = faqData.faqItems || faqData.faqs
      let count = 0

      for (const faq of faqs) {
        try {
          await payload.create({
            collection: 'faq',
            data: {
              question: faq.question,
              answer: faq.answer,
              category: 'general',
              order: count,
            },
          })
          count++
          console.log(`  ✓ ${faq.question.substring(0, 50)}...`)
        } catch (error) {
          console.error(`  ✗ Error creating FAQ:`, error)
        }
      }
      console.log(`✅ Migrated ${count} FAQ items\n`)
    }

    console.log('\n✨ Migration complete!')
    console.log('\n📝 Next steps:')
    console.log('  1. Run image migration: npm run migrate:images')
    console.log('  2. Create an admin user via the admin panel')
    console.log('  3. Link images to migrated content')
    console.log('  4. Update author fields on blog posts')
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  }

  process.exit(0)
}

// Run migration
migrate()
