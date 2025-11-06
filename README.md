# Synergy CMS

Payload CMS voor de Synergy Website. Een headless CMS met Appwrite Storage integratie.

## 🚀 Quick Start

### 1. Installeer dependencies
```bash
npm install
```

### 2. Configureer environment variabelen
Kopieer `.env.example` naar `.env` en vul je credentials in:

```bash
cp .env.example .env
```

**Vereiste environment variabelen:**
- `DATABASE_URI`: MongoDB connection string
- `PAYLOAD_SECRET`: Random string (min 32 characters)
- `APPWRITE_PROJECT_ID`: Je Appwrite project ID
- `APPWRITE_API_KEY`: Je Appwrite server API key

### 3. Start development server
```bash
npm run dev
```

De CMS admin interface is beschikbaar op: http://localhost:3001/admin

## 📁 Project Structuur

```
synergy-cms/
├── src/
│   ├── collections/        # Payload collections (content types)
│   │   ├── Users.ts
│   │   ├── Media.ts
│   │   ├── BlogPosts.ts
│   │   ├── Products.ts
│   │   └── ...
│   ├── plugins/           # Custom Payload plugins
│   ├── payload.config.ts  # Hoofdconfiguratie
│   └── server.ts          # Express server
├── scripts/               # Utility scripts
│   ├── migrate-data.ts    # Data migratie script
│   └── migrate-images.ts  # Image migratie script
└── media/                 # Uploaded media files
```

## 🔧 Available Commands

- `npm run dev` - Start development server met hot reload
- `npm run build` - Build voor productie
- `npm run serve` - Start productie server
- `npm run generate:types` - Genereer TypeScript types
- `npm run migrate:data` - Migreer data van JavaScript files
- `npm run migrate:images` - Upload images naar Appwrite

## 📚 Collections

### Content Collections
- **Blog Posts**: Blog artikelen met rich text editor
- **Team Members**: Team leden met foto's en bio
- **Testimonials**: Klant reviews en testimonials
- **Features**: Product features
- **Services**: Services/diensten
- **FAQ**: Veelgestelde vragen
- **Pricing Plans**: Prijsplannen

### E-commerce
- **Products**: Producten met afbeeldingen, prijzen, en voorraad

### Utilities
- **Integrations**: Third-party integraties
- **Media**: Afbeeldingen en bestanden

### Admin
- **Users**: CMS gebruikers met rollen (Admin, Editor, Author)

## 🔐 User Rollen

- **Admin**: Volledige rechten, kan alles beheren
- **Editor**: Kan alle content bewerken
- **Author**: Kan alleen eigen content bewerken

## 🌍 API Endpoints

Alle collections zijn beschikbaar via REST en GraphQL:

**REST API:**
- `GET /api/blog-posts` - Alle blog posts
- `GET /api/blog-posts/:id` - Specifieke blog post
- `GET /api/products` - Alle producten
- etc.

**GraphQL:**
- `POST /api/graphql` - GraphQL endpoint

## 📖 Documentatie

Zie de volledige Payload documentatie: https://payloadcms.com/docs

## 🔄 Deployment

### Railway (Aanbevolen)

1. Install Railway CLI: `npm i -g @railway/cli`
2. Login: `railway login`
3. Init project: `railway init`
4. Add MongoDB: `railway add`
5. Deploy: `railway up`

### Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Deploy: `vercel --prod`

## 🐛 Troubleshooting

**MongoDB connection error:**
- Check je `DATABASE_URI` in `.env`
- Zorg dat MongoDB draait (lokaal of Atlas)

**Admin panel laadt niet:**
- Check of poort 3001 beschikbaar is
- Run `npm run build` en probeer opnieuw

**Image upload werkt niet:**
- Check Appwrite credentials
- Controleer of de bucket bestaat en public is

## 📝 License

Proprietary - Synergy
