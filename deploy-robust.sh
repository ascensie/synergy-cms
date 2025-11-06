#!/bin/bash

# Robust Payload CMS Deployment Script for admin.funnelsynergy.io
# This script handles connection issues and large file transfers better

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
SSH_PASSWORD='&uf0bR7Bpzjf~5Wn'

# Step 1: Build the application
echo -e "${YELLOW}📦 Building application...${NC}"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Build failed. Aborting deployment.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build completed successfully${NC}"

# Step 2: Check if sshpass is installed
if ! command -v sshpass &> /dev/null; then
    echo -e "${RED}❌ sshpass is not installed.${NC}"
    echo -e "${YELLOW}Install it with: brew install hudochenkov/sshpass/sshpass${NC}"
    exit 1
fi

# Step 3: Test SSH connection
echo -e "${YELLOW}🔌 Testing SSH connection...${NC}"
sshpass -p "$SSH_PASSWORD" ssh -p ${SERVER_PORT} \
  -o StrictHostKeyChecking=no \
  -o UserKnownHostsFile=/dev/null \
  -o ConnectTimeout=10 \
  "${SERVER_USER}@${SERVER_HOST}" "echo 'Connection successful'" 2>/dev/null

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ SSH connection failed. Please check your credentials and network.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ SSH connection established${NC}"

# Step 4: Sync files to server with better options
echo -e "${YELLOW}📤 Syncing files to server (this may take a few minutes)...${NC}"

# Use more robust rsync options:
# -a: archive mode
# -v: verbose
# -z: compress during transfer
# --progress: show progress
# --partial: keep partially transferred files
# --timeout=300: set I/O timeout to 5 minutes
# --contimeout=60: set connection timeout to 60 seconds
# --bwlimit=10000: limit bandwidth to 10MB/s (prevents overwhelming connection)

sshpass -p "$SSH_PASSWORD" rsync -avz \
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
  -e "ssh -p ${SERVER_PORT} -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -o ServerAliveInterval=30 -o ServerAliveCountMax=3" \
  ./ "${SERVER_USER}@${SERVER_HOST}:${SERVER_PATH}/"

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ File sync failed.${NC}"
    echo -e "${YELLOW}💡 Try running the script again - rsync will resume from where it stopped${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Files synced successfully${NC}"

# Step 5: Install dependencies and restart on server
echo -e "${YELLOW}📦 Installing dependencies on server...${NC}"

sshpass -p "$SSH_PASSWORD" ssh -p ${SERVER_PORT} \
  -o StrictHostKeyChecking=no \
  -o UserKnownHostsFile=/dev/null \
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
    pm2 restart synergy-cms || pm2 start dist/server.js --name synergy-cms
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
echo "1. Check application logs: ssh -p 6040 ${SERVER_USER}@${SERVER_HOST} and run 'pm2 logs synergy-cms'"
echo "2. Verify admin panel is accessible"
echo "3. Test database connections"
echo "4. Test file uploads"
