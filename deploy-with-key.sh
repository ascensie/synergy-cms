#!/bin/bash

# Payload CMS Deployment Script (Using SSH Key Authentication)
# This is the RECOMMENDED deployment method for better security

set -e  # Exit on any error

echo "🚀 Starting deployment to admin.funnelsynergy.io..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

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

# Step 2: Test SSH connection
echo -e "${YELLOW}🔌 Testing SSH connection...${NC}"

# Test SSH connection (allow password prompt if no key is set up)
ssh -p ${SERVER_PORT} \
  -o ConnectTimeout=10 \
  "${SERVER_USER}@${SERVER_HOST}" "echo 'Connection test successful'"

SSH_EXIT_CODE=$?

if [ $SSH_EXIT_CODE -ne 0 ]; then
    echo -e "${RED}❌ SSH connection failed (exit code: ${SSH_EXIT_CODE}).${NC}"
    echo -e "${YELLOW}💡 Options:${NC}"
    echo -e "${YELLOW}   1. Set up SSH key: ssh-copy-id -p ${SERVER_PORT} ${SERVER_USER}@${SERVER_HOST}${NC}"
    echo -e "${YELLOW}   2. Or use deploy.sh (with password authentication)${NC}"
    exit 1
fi

echo -e "${GREEN}✅ SSH connection established${NC}"

# Step 3: Sync files to server with robust options
echo -e "${YELLOW}📤 Syncing files to server (this may take a few minutes)...${NC}"

rsync -avz \
  --progress \
  --partial \
  --timeout=300 \
  --contimeout=60 \
  --bwlimit=10000 \
  --delete \
  --exclude 'node_modules' \
  --exclude '.git' \
  --exclude '.gitignore' \
  --exclude '.DS_Store' \
  --exclude '*.log' \
  --exclude '.env.local' \
  --exclude 'deploy*.sh' \
  --exclude 'DEPLOYMENT.md' \
  --exclude '.next' \
  --exclude 'coverage' \
  --exclude '.cache' \
  -e "ssh -p ${SERVER_PORT} -o ServerAliveInterval=30 -o ServerAliveCountMax=3" \
  ./ "${SERVER_USER}@${SERVER_HOST}:${SERVER_PATH}/"

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ File sync failed.${NC}"
    echo -e "${YELLOW}💡 Try running the script again - rsync will resume from where it stopped${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Files synced successfully${NC}"

# Step 4: Install dependencies and restart on server
echo -e "${YELLOW}📦 Installing dependencies on server...${NC}"

ssh -p ${SERVER_PORT} \
  -o ServerAliveInterval=30 \
  -o ServerAliveCountMax=3 \
  "${SERVER_USER}@${SERVER_HOST}" << 'ENDSSH'
cd /var/www/funnelsynergy.io/admin.funnelsynergy.io

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
    echo -e "${RED}❌ Server setup failed.${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
echo -e "${GREEN}Your application should be running at: https://admin.funnelsynergy.io${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Check application logs: ssh -p ${SERVER_PORT} ${SERVER_USER}@${SERVER_HOST} and run 'pm2 logs synergy-cms'"
echo "2. Verify admin panel is accessible"
echo "3. Test database connections"
echo "4. Test file uploads"
