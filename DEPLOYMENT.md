# Deployment Guide for Synergy CMS

This guide covers deploying the Payload CMS application to **admin.funnelsynergy.io**.

## Quick Start

### Option 1: Deploy with Password (Quick but less secure)
```bash
./deploy.sh
```

### Option 2: Deploy with SSH Key (Recommended)
```bash
./deploy-with-key.sh
```

---

## Prerequisites

### Local Machine
- Node.js v18+ installed
- `sshpass` installed (for password-based deployment)
  ```bash
  brew install hudochenkov/sshpass/sshpass
  ```

### Remote Server
- Node.js v18+ installed
- PM2 process manager installed globally
  ```bash
  npm install -g pm2
  ```
- MongoDB accessible from server
- Nginx configured as reverse proxy (see below)

---

## Initial Server Setup

### 1. SSH into the Server
```bash
ssh -p 6040 funnelsynergy.io_twej7bvyil@admin.funnelsynergy.io
```

### 2. Create Application Directory
```bash
mkdir -p /var/www/funnelsynergy.io/admin.funnelsynergy.io
cd /var/www/funnelsynergy.io/admin.funnelsynergy.io
```

### 3. Install PM2 (if not installed)
```bash
npm install -g pm2
pm2 startup
# Follow the instructions to enable PM2 on system boot
```

### 4. Create Logs Directory
```bash
mkdir -p /var/www/funnelsynergy.io/admin.funnelsynergy.io/logs
```

### 5. Configure Environment Variables
Create or update `.env` file on the server with production values:
```bash
nano /var/www/funnelsynergy.io/admin.funnelsynergy.io/.env
```

**Important environment variables:**
```env
# Server Configuration
PAYLOAD_PUBLIC_SERVER_URL=https://admin.funnelsynergy.io
PORT=7070
NODE_ENV=production

# Database
DATABASE_URI=your_mongodb_connection_string

# Payload CMS
PAYLOAD_SECRET=your_secret_key_here

# Appwrite Configuration
NEXT_PUBLIC_APPWRITE_ENDPOINT=your_appwrite_endpoint
NEXT_PUBLIC_APPWRITE_PROJECT=your_project_id
APPWRITE_API_KEY=your_api_key

# CORS Configuration
NEXT_PUBLIC_URL=https://funnelsynergy.io
```

---

## Nginx Configuration

### Create Nginx Site Configuration
```bash
sudo nano /etc/nginx/sites-available/admin.funnelsynergy.io
```

Add the following configuration:
```nginx
server {
    listen 80;
    server_name admin.funnelsynergy.io;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name admin.funnelsynergy.io;

    # SSL Configuration (Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/admin.funnelsynergy.io/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/admin.funnelsynergy.io/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Logging
    access_log /var/log/nginx/admin.funnelsynergy.io-access.log;
    error_log /var/log/nginx/admin.funnelsynergy.io-error.log;

    # Upload size limit (increase for large media uploads)
    client_max_body_size 50M;

    # Proxy to Node.js application
    location / {
        proxy_pass http://localhost:7070;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        # Timeouts for long requests
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }
}
```

### Enable the Site
```bash
sudo ln -s /etc/nginx/sites-available/admin.funnelsynergy.io /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Setup SSL Certificate (Let's Encrypt)
```bash
sudo apt-get install certbot python3-certbot-nginx  # Ubuntu/Debian
sudo certbot --nginx -d admin.funnelsynergy.io
```

---

## Deployment Process

### 1. Build and Deploy
```bash
# From your local machine, in the project directory
./deploy.sh
```

This script will:
1. Build the application locally (`npm run build`)
2. Sync files to the server via rsync
3. Install production dependencies on the server
4. Restart the application with PM2

### 2. Verify Deployment
```bash
# SSH into server
ssh -p 6040 funnelsynergy.io_twej7bvyil@admin.funnelsynergy.io

# Check PM2 status
pm2 status

# View application logs
pm2 logs synergy-cms

# View recent logs
pm2 logs synergy-cms --lines 100
```

### 3. Test the Application
- Visit https://admin.funnelsynergy.io
- Log in to the admin panel
- Test database connections
- Test file uploads
- Check all functionality

---

## PM2 Management Commands

### Start Application
```bash
pm2 start ecosystem.config.js
# or
pm2 start dist/server.js --name synergy-cms
```

### Stop Application
```bash
pm2 stop synergy-cms
```

### Restart Application
```bash
pm2 restart synergy-cms
```

### View Logs
```bash
pm2 logs synergy-cms
pm2 logs synergy-cms --lines 200  # Last 200 lines
pm2 logs synergy-cms --err  # Only errors
```

### Monitor Resources
```bash
pm2 monit
```

### Application Information
```bash
pm2 info synergy-cms
```

### Save PM2 Configuration
```bash
pm2 save
```

### List All Applications
```bash
pm2 list
```

---

## Troubleshooting

### Application Won't Start
1. Check logs: `pm2 logs synergy-cms --err`
2. Verify environment variables: `cat .env`
3. Check MongoDB connection
4. Verify port 7070 is available: `lsof -i :7070`

### Database Connection Issues
1. Verify MongoDB connection string in `.env`
2. Check if MongoDB server is accessible: `ping your-mongodb-host`
3. Verify firewall rules allow connection to MongoDB

### File Upload Issues
1. Verify Appwrite credentials in `.env`
2. Check Appwrite endpoint is accessible
3. Verify API key has correct permissions

### Nginx Issues
1. Check configuration: `sudo nginx -t`
2. View error logs: `sudo tail -f /var/log/nginx/admin.funnelsynergy.io-error.log`
3. Verify SSL certificates: `sudo certbot certificates`

### Out of Memory
1. Check memory usage: `pm2 monit`
2. Increase max memory in `ecosystem.config.js`
3. Consider adding swap space or upgrading server

---

## Security Best Practices

### 1. Use SSH Keys Instead of Passwords
```bash
# Generate SSH key on local machine
ssh-keygen -t ed25519 -C "your_email@example.com"

# Copy key to server (note the custom port)
ssh-copy-id -p 6040 funnelsynergy.io_twej7bvyil@admin.funnelsynergy.io

# Use deploy-with-key.sh instead of deploy.sh
```

### 2. Secure Environment Variables
- Never commit `.env` to git
- Store `.env` only on the server
- Use strong, unique secrets for `PAYLOAD_SECRET`

### 3. Keep Dependencies Updated
```bash
npm audit
npm audit fix
```

### 4. Regular Backups
- Backup MongoDB database regularly
- Backup uploaded media files (Appwrite)
- Keep backups offsite

### 5. Monitor Logs
```bash
# Set up log rotation
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 30
```

---

## Rollback Procedure

If deployment fails or introduces issues:

### 1. Check Current Version
```bash
cd /var/www/funnelsynergy.io/admin.funnelsynergy.io
git log -1  # If using git on server
```

### 2. Restore Previous Version
```bash
# If you keep backups
cp -r /var/www/funnelsynergy.io/admin.funnelsynergy.io.backup/* /var/www/funnelsynergy.io/admin.funnelsynergy.io/

# Restart application
pm2 restart synergy-cms
```

---

## Maintenance

### Update Node.js
```bash
# Using nvm (recommended)
nvm install 18
nvm use 18
npm install -g pm2
pm2 update
```

### Update Dependencies
```bash
cd /var/www/funnelsynergy.io/admin.funnelsynergy.io
npm install --production
pm2 restart synergy-cms
```

### Check Disk Space
```bash
df -h
du -sh /var/www/funnelsynergy.io/admin.funnelsynergy.io/*
```

### Clean Old Logs
```bash
pm2 flush  # Clear PM2 logs
pm2 reloadLogs
```

---

## Support

For issues or questions:
1. Check PM2 logs: `pm2 logs synergy-cms`
2. Check Nginx logs: `sudo tail -f /var/log/nginx/admin.funnelsynergy.io-error.log`
3. Verify environment configuration
4. Contact system administrator

---

## Quick Reference Commands

```bash
# Deploy
./deploy.sh

# Check status
pm2 status

# View logs
pm2 logs synergy-cms

# Restart
pm2 restart synergy-cms

# SSH to server
ssh -p 6040 funnelsynergy.io_twej7bvyil@admin.funnelsynergy.io
```
