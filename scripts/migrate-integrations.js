/**
 * Migratie Script: Importeer Integraties naar Payload CMS
 *
 * Dit script importeert alle integraties van de website naar Payload CMS
 *
 * Gebruik:
 * 1. Zorg dat Payload CMS draait (npm run dev in synergy-cms)
 * 2. Run: node scripts/migrate-integrations.js
 */

const integrations = [
  // 🌐 Google Integraties
  {
    id: 1,
    name: "Google Calendar",
    category: "Agenda",
    description: "Synchroniseer afspraken en agenda's automatisch met je CRM en blijf op de hoogte van belangrijke momenten.",
    imageUrl: "/assets/images/integrations/google_calendar_logo_icon_159345.png",
    imageAlt: "Google Calendar",
  },
  {
    id: 2,
    name: "Google Analytics",
    category: "Advertentieplatform",
    description: "Analyseer websiteverkeer en gebruikersgedrag voor betere inzichten en datagedreven beslissingen.",
    imageUrl: "/assets/images/integrations/integratie-logos-2.webp",
    imageAlt: "Google Analytics",
  },
  {
    id: 3,
    name: "Google Bedrijfsprofiel",
    category: "Socialmediaplatform",
    description: "Beheer je online aanwezigheid op Google Search en Maps, en bereik meer klanten.",
    imageUrl: "/assets/images/integrations/integratie-logos-3.webp",
    imageAlt: "Google Bedrijfsprofiel",
  },
  {
    id: 4,
    name: "Google Contacts",
    category: "Agenda",
    description: "Synchroniseer contacten tussen Google en je CRM voor een centraal contactbeheer.",
    imageUrl: "/assets/images/integrations/integratie-logos-4.webp",
    imageAlt: "Google Contacts",
  },
  {
    id: 5,
    name: "Gmail",
    category: "E-mail",
    description: "Integreer e-mailcommunicatie naadloos in je workflow en automatiseer follow-ups.",
    imageUrl: "/assets/images/integrations/integratie-logos-7.webp",
    imageAlt: "Gmail",
  },
  {
    id: 6,
    name: "Google Ads",
    category: "Advertentieplatform",
    description: "Optimaliseer advertentiecampagnes en track conversies voor maximale ROI.",
    imageUrl: "/assets/images/integrations/integratie-logos-8-1024x768.webp",
    imageAlt: "Google Ads",
  },

  // 💬 Communicatie & Social Media
  {
    id: 7,
    name: "Facebook",
    category: "Socialmediaplatform",
    description: "Beheer je Facebook bedrijfspagina, posts en interacties vanuit één platform.",
    imageUrl: "/assets/images/integrations/facebook-logo-facebook-icon-transparent-free-png-1024x1024.webp",
    imageAlt: "Facebook",
  },
  {
    id: 8,
    name: "Facebook Messenger",
    category: "Berichten",
    description: "Automatiseer klantenservice via Messenger en reageer sneller op berichten.",
    imageUrl: "/assets/images/integrations/kisspng-social-network-advertising-computer-icons-facebook-5b291f1f07fcd4.3861071415294215990327.webp",
    imageAlt: "Facebook Messenger",
  },
  {
    id: 9,
    name: "Facebook Ads",
    category: "Advertentieplatform",
    description: "Creëer en beheer gerichte advertentiecampagnes voor maximaal bereik en conversie.",
    imageUrl: "/assets/images/integrations/facebook-logo-facebook-icon-transparent-free-png-1024x1024.webp",
    imageAlt: "Facebook Ads",
  },
  {
    id: 10,
    name: "Instagram",
    category: "Socialmediaplatform",
    description: "Plan posts, analyseer engagement en beheer je Instagram zakelijke account.",
    imageUrl: "/assets/images/integrations/images.jpeg",
    imageAlt: "Instagram",
  },
  {
    id: 11,
    name: "TikTok",
    category: "Socialmediaplatform",
    description: "Beheer content en advertenties op TikTok om een jonger publiek te bereiken.",
    imageUrl: "/assets/images/integrations/tiktok-5962992_1280-1024x1024.webp",
    imageAlt: "TikTok",
  },
  {
    id: 12,
    name: "LinkedIn",
    category: "Socialmediaplatform",
    description: "Versterk je professionele netwerk en genereer B2B leads via LinkedIn.",
    imageUrl: "/assets/images/integrations/download (1).png",
    imageAlt: "LinkedIn",
  },
  {
    id: 13,
    name: "X (Twitter)",
    category: "Socialmediaplatform",
    description: "Plan tweets, monitor mentions en analyseer social media engagement.",
    imageUrl: "/assets/images/integrations/new-2023-twitter-logo-x-icon-design_1017-45418.avif",
    imageAlt: "X (Twitter)",
  },
  {
    id: 14,
    name: "WhatsApp",
    category: "Berichten",
    description: "Automatiseer klantcommunicatie via WhatsApp Business voor betere klantenservice.",
    imageUrl: "/assets/images/integrations/whatsapp_integrations.svg",
    imageAlt: "WhatsApp",
  },
  {
    id: 15,
    name: "Pinterest",
    category: "Socialmediaplatform",
    description: "Deel visuele content en drive traffic naar je website via Pinterest.",
    imageUrl: "/assets/images/integrations/Pinterest-logo.png",
    imageAlt: "Pinterest",
  },
  {
    id: 16,
    name: "YouTube",
    category: "Socialmediaplatform",
    description: "Beheer video content, analyseer kijkersstatistieken en optimaliseer je kanaal.",
    imageUrl: "/assets/images/integrations/Youtube_logo.png",
    imageAlt: "YouTube",
  },
  {
    id: 17,
    name: "Slack",
    category: "Berichten",
    description: "Ontvang realtime notificaties en updates in je team kanalen voor betere samenwerking.",
    imageUrl: "/assets/images/integrations/medallion-slack.svg",
    imageAlt: "Slack",
  },

  // 💰 Betalingen & E-commerce
  {
    id: 18,
    name: "Stripe",
    category: "Betaalprovider",
    description: "Accepteer online betalingen veilig en eenvoudig via creditcard en ACH.",
    imageUrl: "/assets/images/template/tool-stripe.svg",
    imageAlt: "Stripe",
  },
  {
    id: 19,
    name: "PayPal",
    category: "Betaalprovider",
    description: "Bied een vertrouwde betaaloptie aan je klanten voor een soepele checkout.",
    imageUrl: "/assets/images/integrations/Paypal_2014_logo.png",
    imageAlt: "PayPal",
  },
  {
    id: 20,
    name: "Shopify",
    category: "Webshops",
    description: "Synchroniseer je webshop met je CRM en marketing tools voor geïntegreerd e-commerce.",
    imageUrl: "/assets/images/integrations/medallion-shopify.png",
    imageAlt: "Shopify",
  },
  {
    id: 21,
    name: "WooCommerce",
    category: "Webshops",
    description: "Integreer je WordPress webshop naadloos voor geautomatiseerd orderbeheer.",
    imageUrl: "/assets/images/integrations/woocommerce-logo.svg",
    imageAlt: "WooCommerce",
  },
  {
    id: 22,
    name: "Printful",
    category: "Webshops",
    description: "Automatiseer print-on-demand fulfilment voor je producten zonder voorraad.",
    imageUrl: "/assets/images/integrations/printful-logo.svg",
    imageAlt: "Printful",
  },
  {
    id: 23,
    name: "Printify",
    category: "Webshops",
    description: "Maak en verkoop custom merchandise zonder voorraad met print-on-demand.",
    imageUrl: "/assets/images/integrations/printify-logo.svg",
    imageAlt: "Printify",
  },
  {
    id: 24,
    name: "Shippo",
    category: "Webshops",
    description: "Vergelijk verzendtarieven en genereer verzendlabels voor efficiënte verzending.",
    imageUrl: "/assets/images/integrations/shippo-logo.svg",
    imageAlt: "Shippo",
  },
  {
    id: 25,
    name: "ShipStation",
    category: "Webshops",
    description: "Stroomlijn je verzendproces en order management voor snellere fulfilment.",
    imageUrl: "/assets/images/integrations/shipstation-logo.svg",
    imageAlt: "ShipStation",
  },

  // 📅 Planning & Productivity
  {
    id: 26,
    name: "Outlook Calendar",
    category: "Agenda",
    description: "Synchroniseer afspraken met Microsoft Outlook voor naadloos agendabeheer.",
    imageUrl: "/assets/images/integrations/download.png",
    imageAlt: "Outlook Calendar",
  },
  {
    id: 27,
    name: "Microsoft Outlook",
    category: "E-mail",
    description: "Integreer e-mail en agenda in je workflow voor gecentraliseerde communicatie.",
    imageUrl: "/assets/images/integrations/download.png",
    imageAlt: "Microsoft Outlook",
  },
  {
    id: 28,
    name: "ClickUp",
    category: "Automatiseringsplatform",
    description: "Beheer projecten, taken en doelen in één overzichtelijk platform.",
    imageUrl: "/assets/images/integrations/integratie-logos-10.webp",
    imageAlt: "ClickUp",
  },
  {
    id: 29,
    name: "Notion",
    category: "Automatiseringsplatform",
    description: "Centraliseer documentatie, notities en kennisbeheer in één workspace.",
    imageUrl: "/assets/images/integrations/08a33bc428df4f215f7cb2066594e026.svg",
    imageAlt: "Notion",
  },
  {
    id: 30,
    name: "Airtable",
    category: "Automatiseringsplatform",
    description: "Organiseer data met flexibele spreadsheets en databases voor elk project.",
    imageUrl: "/assets/images/integrations/APPk5y29_400x400.png",
    imageAlt: "Airtable",
  },
  {
    id: 31,
    name: "Basecamp",
    category: "Automatiseringsplatform",
    description: "Coördineer projecten en teamcommunicatie in één georganiseerde ruimte.",
    imageUrl: "/assets/images/integrations/asana.png",
    imageAlt: "Basecamp",
  },
  {
    id: 32,
    name: "Typeform",
    category: "Automatiseringsplatform",
    description: "Verzamel feedback en leads via interactieve, gebruiksvriendelijke formulieren.",
    imageUrl: "/assets/images/integrations/bitbucket.png",
    imageAlt: "Typeform",
  },

  // 🧾 Boekhouding & Financieel
  {
    id: 33,
    name: "QuickBooks",
    category: "Betaalprovider",
    description: "Automatiseer facturatie en boekhoudprocessen voor nauwkeurig financieel beheer.",
    imageUrl: "/assets/images/integrations/hubspot.png",
    imageAlt: "QuickBooks",
  },
  {
    id: 34,
    name: "Xero",
    category: "Betaalprovider",
    description: "Beheer financiën en synchroniseer met je bank voor realtime inzicht.",
    imageUrl: "/assets/images/integrations/monday.png",
    imageAlt: "Xero",
  },
  {
    id: 35,
    name: "Wave",
    category: "Betaalprovider",
    description: "Gratis boekhoudoftware voor kleine ondernemingen met facturatie en betalingen.",
    imageUrl: "/assets/images/integrations/mailchimp.png",
    imageAlt: "Wave",
  },
  {
    id: 36,
    name: "Clio",
    category: "Betaalprovider",
    description: "Juridische practice management en facturatie voor advocatenkantoren.",
    imageUrl: "/assets/images/integrations/medallion-clio.png",
    imageAlt: "Clio",
  },

  // ⚙️ Automatisering
  {
    id: 37,
    name: "Zapier",
    category: "Automatiseringsplatform",
    description: "Automatiseer workflows tussen duizenden apps zonder code te schrijven.",
    imageUrl: "/assets/images/integrations/zapier.png",
    imageAlt: "Zapier",
  },
  {
    id: 38,
    name: "SureTriggers",
    category: "Automatiseringsplatform",
    description: "Creëer geavanceerde automatiseringen zonder code voor complexe workflows.",
    imageUrl: "/assets/images/integrations/drive.png",
    imageAlt: "SureTriggers",
  },

  // Bestaande CRM integraties (behouden)
  {
    id: 39,
    name: "Salesforce",
    category: "Automatiseringsplatform",
    description: "Maak een blijvende indruk binnen het Salesforce CPQ platform.",
    imageUrl: "/assets/images/integrations/saleforce.png",
    imageAlt: "Salesforce",
  },
  {
    id: 40,
    name: "HubSpot",
    category: "Automatiseringsplatform",
    description: "Vergroot de ROI van je CRM en ontgrendel eenvoudige lead generation mogelijkheden.",
    imageUrl: "/assets/images/integrations/hubspot.png",
    imageAlt: "HubSpot",
  },
];

const PAYLOAD_URL = process.env.PAYLOAD_URL || 'http://localhost:7070';
const PAYLOAD_SECRET = process.env.PAYLOAD_SECRET;

async function migrateIntegrations() {
  console.log('🚀 Starting integration migration to Payload CMS...\n');
  console.log(`📍 Payload URL: ${PAYLOAD_URL}`);
  console.log(`📊 Total integrations to migrate: ${integrations.length}\n`);

  let successCount = 0;
  let errorCount = 0;
  const errors = [];

  for (const integration of integrations) {
    try {
      console.log(`⏳ Migrating: ${integration.name} (${integration.category})...`);

      const payload = {
        name: integration.name,
        description: integration.description,
        imageUrl: integration.imageUrl,
        imageAlt: integration.imageAlt,
        category: integration.category,
        order: integration.id,
        status: 'published',
        featured: false,
      };

      const response = await fetch(`${PAYLOAD_URL}/api/integrations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(PAYLOAD_SECRET && { 'Authorization': `JWT ${PAYLOAD_SECRET}` }),
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      console.log(`✅ Successfully migrated: ${integration.name} (ID: ${result.doc.id})`);
      successCount++;

    } catch (error) {
      console.error(`❌ Failed to migrate ${integration.name}:`, error.message);
      errorCount++;
      errors.push({
        name: integration.name,
        error: error.message,
      });
    }

    // Small delay to avoid overwhelming the API
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log('\n' + '='.repeat(60));
  console.log('📈 Migration Summary:');
  console.log('='.repeat(60));
  console.log(`✅ Successfully migrated: ${successCount}/${integrations.length}`);
  console.log(`❌ Failed: ${errorCount}/${integrations.length}`);

  if (errors.length > 0) {
    console.log('\n❌ Errors:');
    errors.forEach(({ name, error }) => {
      console.log(`  - ${name}: ${error}`);
    });
  }

  console.log('\n✨ Migration complete!\n');

  if (successCount > 0) {
    console.log(`🎉 ${successCount} integraties zijn succesvol geïmporteerd naar Payload CMS!`);
    console.log(`🔗 Bekijk ze in de admin: ${PAYLOAD_URL}/admin/collections/integrations`);
  }

  if (errorCount > 0) {
    console.log(`\n⚠️  ${errorCount} integraties konden niet worden geïmporteerd.`);
    console.log('💡 Check of Payload CMS draait en of je ingelogd bent.');
  }
}

// Run the migration
migrateIntegrations().catch(error => {
  console.error('💥 Migration failed with error:', error);
  process.exit(1);
});
