# Appwrite Setup Instructies

## Stap 1: Maak een Appwrite Account en Project

1. Ga naar https://cloud.appwrite.io
2. Maak een account aan (of login)
3. Klik op "Create Project"
4. Naam: "Synergy CMS"
5. Project ID wordt automatisch gegenereerd - kopieer deze!

## Stap 2: Maak een Database

1. Klik in de linker sidebar op "Databases"
2. Klik "Create Database"
3. Database ID: `synergy-content`
4. Name: "Synergy Content"
5. Klik "Create"

## Stap 3: Maak een Storage Bucket

1. Klik in de linker sidebar op "Storage"
2. Klik "Create Bucket"
3. Bucket ID: `cms-uploads`
4. Name: "CMS Uploads"
5. Maximum File Size: `50MB` (of naar wens)
6. Allowed File Extensions: `jpg,jpeg,png,gif,webp,svg`
7. Compression: `gzip` (aanbevolen)
8. Encryption: Aan (aanbevolen)
9. Antivirus: Aan (aanbevolen op productie)

### Configureer Bucket Permissions

1. Klik op de `cms-uploads` bucket
2. Ga naar de "Settings" tab
3. Onder "Permissions":
   - Voeg toe: `Role: any` met `read` permission (voor public toegang)
   - Voeg toe: `Role: users` met `create`, `update`, `delete` permissions

## Stap 4: Genereer API Key

1. Klik in de linker sidebar op "Overview"
2. Scroll naar beneden naar "Integrate with your server"
3. Klik op "API Keys" in de linker sidebar
4. Klik "Create API Key"
5. Name: "Synergy CMS Server Key"
6. Expiration: "Never" of stel een lange expiry in
7. Scopes: Selecteer ALLE scopes of minimaal:
   - `databases.read`
   - `databases.write`
   - `files.read`
   - `files.write`
8. Klik "Create"
9. **KOPIEER DE API KEY METEEN** - je kunt hem niet meer terugzien!

## Stap 5: Update .env Bestand

Open `/Users/timreininga/Documents/synergy-cms/.env` en update de volgende waarden:

```env
# Appwrite - Update met je Appwrite project credentials
APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
APPWRITE_PROJECT_ID=<je-project-id-hier>
APPWRITE_API_KEY=<je-server-api-key-hier>
APPWRITE_BUCKET_ID=cms-uploads
```

## Stap 6: MongoDB Setup (Optioneel - als je nog geen database hebt)

### Optie A: MongoDB Atlas (Cloud - Gratis)

1. Ga naar https://www.mongodb.com/cloud/atlas
2. Maak een account aan
3. Klik "Build a Database"
4. Kies "FREE" tier (M0 Sandbox)
5. Cloud Provider: AWS
6. Region: Kies dichtstbijzijnde (bijv. Frankfurt voor Europa)
7. Cluster Name: `synergy-cluster`
8. Klik "Create"
9. Wacht tot cluster klaar is (1-3 minuten)

**Database Access:**
1. Ga naar "Database Access" in linker menu
2. Klik "Add New Database User"
3. Username: `synergy-admin`
4. Password: Genereer een sterk wachtwoord (sla op!)
5. Database User Privileges: "Atlas admin"
6. Klik "Add User"

**Network Access:**
1. Ga naar "Network Access" in linker menu
2. Klik "Add IP Address"
3. Klik "Allow Access from Anywhere" (0.0.0.0/0)
   - Voor productie: voeg specifieke IP's toe
4. Klik "Confirm"

**Connection String:**
1. Ga terug naar "Database"
2. Klik "Connect" op je cluster
3. Kies "Connect your application"
4. Driver: Node.js, Version: 5.5 or later
5. Kopieer de connection string
6. Vervang `<password>` met je database wachtwoord
7. Vervang `<dbname>` met `synergy-cms`

Update `.env`:
```env
DATABASE_URI=mongodb+srv://synergy-admin:<password>@synergy-cluster.xxxxx.mongodb.net/synergy-cms?retryWrites=true&w=majority
```

### Optie B: Lokale MongoDB

Als je MongoDB lokaal hebt draaien:
```env
DATABASE_URI=mongodb://localhost:27017/synergy-cms
```

## Stap 7: Genereer Payload Secret

Genereer een veilige random string voor `PAYLOAD_SECRET`:

```bash
# Mac/Linux
openssl rand -base64 32

# Of gebruik een online generator
# https://www.random.org/strings/
```

Update `.env`:
```env
PAYLOAD_SECRET=<je-gegenereerde-secret-hier>
```

## Stap 8: Test de Setup

Start de development server:

```bash
cd /Users/timreininga/Documents/synergy-cms
npm run dev
```

Als alles goed is, zie je:
```
🚀 Synergy CMS gestart op http://localhost:3001
📝 Admin panel: http://localhost:3001/admin
```

Open http://localhost:3001/admin in je browser.

## Stap 9: Maak een Admin User

Bij eerste keer openen van het admin panel:
1. Email: je email adres
2. Password: een sterk wachtwoord
3. Name: je naam
4. Role wordt automatisch "admin" voor de eerste user
5. Klik "Create"

Je bent nu ingelogd in het Payload CMS admin panel! 🎉

## Troubleshooting

**"Failed to connect to database"**
- Check je `DATABASE_URI` in `.env`
- Voor MongoDB Atlas: check of IP address whitelisted is
- Voor lokale MongoDB: check of MongoDB draait (`brew services start mongodb-community` op Mac)

**"Invalid API key"**
- Check of `APPWRITE_API_KEY` correct is
- Check of de API key niet is verlopen
- Genereer een nieuwe key als nodig

**"Bucket not found"**
- Check of `APPWRITE_BUCKET_ID` overeenkomt met je bucket ID in Appwrite
- Check of de bucket bestaat in je project

**Admin panel laadt niet**
- Check of poort 3001 beschikbaar is
- Check console voor errors: `npm run dev`
- Clear browser cache en probeer opnieuw

## Volgende Stappen

Nu je setup compleet is, kun je:
1. Data migreren van de bestaande JavaScript files: `npm run migrate:data`
2. Images uploaden naar Appwrite: `npm run migrate:images`
3. De Next.js applicatie updaten om data van Payload te halen

Zie de hoofddocumentatie in `README.md` voor meer informatie.
