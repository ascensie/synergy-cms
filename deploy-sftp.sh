#!/bin/bash

# SFTP-based deployment for Payload CMS
# This uses SFTP instead of rsync to avoid the connection issues

set -e

echo "🚀 Starting SFTP deployment to admin.funnelsynergy.io..."

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Configuration
SERVER_USER="funnelsynergy.io_twej7bvyil"
SERVER_HOST="admin.funnelsynergy.io"
SERVER_PORT="6040"
SERVER_PATH="/var/www/funnelsynergy.io/admin.funnelsynergy.io"

# Step 1: Build the application
echo -e "${YELLOW}📦 Building application...${NC}"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Build failed. Aborting deployment.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build completed successfully${NC}"

# Step 2: Create a tarball of essential files
echo -e "${YELLOW}📦 Creating deployment package...${NC}"

tar -czf deployment.tar.gz \
  --exclude='node_modules' \
  --exclude='.git' \
  --exclude='.DS_Store' \
  --exclude='*.log' \
  --exclude='.env.local' \
  --exclude='deploy*.sh' \
  --exclude='DEPLOYMENT.md' \
  --exclude='.next' \
  --exclude='coverage' \
  --exclude='.cache' \
  --exclude='deployment.tar.gz' \
  ./

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to create package${NC}"
    exit 1
fi

PACKAGE_SIZE=$(du -h deployment.tar.gz | cut -f1)
echo -e "${GREEN}✅ Package created (${PACKAGE_SIZE})${NC}"

# Step 3: Upload via SCP
echo -e "${YELLOW}📤 Uploading to server...${NC}"
echo -e "${YELLOW}You may need to enter your password/passphrase${NC}"

scp -P ${SERVER_PORT} deployment.tar.gz ${SERVER_USER}@${SERVER_HOST}:${SERVER_PATH}/

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Upload failed${NC}"
    rm deployment.tar.gz
    exit 1
fi

echo -e "${GREEN}✅ Upload completed${NC}"

# Clean up local tarball
rm deployment.tar.gz

# Step 4: Extract and setup on server
echo -e "${YELLOW}📦 Extracting and setting up on server...${NC}"

ssh -p ${SERVER_PORT} ${SERVER_USER}@${SERVER_HOST} << 'ENDSSH'
cd /var/www/funnelsynergy.io/admin.funnelsynergy.io

# Extract the tarball
echo "Extracting files..."
tar -xzf deployment.tar.gz
rm deployment.tar.gz

# Install production dependencies
echo "Installing dependencies..."
npm install --production --no-audit

# Restart the application with PM2
if command -v pm2 &> /dev/null; then
    echo "Restarting application with PM2..."
    pm2 restart synergy-cms || pm2 start ecosystem.config.js
    pm2 save
    echo "Application restarted successfully"
else
    echo "⚠️  PM2 not found. Please manually start the application."
fi

echo "✅ Server deployment completed!"
ENDSSH

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Server setup failed${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
echo -e "${GREEN}Your application should be running at: https://admin.funnelsynergy.io${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Check application logs: ssh -p ${SERVER_PORT} ${SERVER_USER}@${SERVER_HOST} and run 'pm2 logs synergy-cms'"
echo "2. Verify admin panel is accessible"
