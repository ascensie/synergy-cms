#!/bin/bash

# Minimal Payload CMS Deployment Script
# This syncs only the essential built files for faster deployment

set -e  # Exit on any error

echo "🚀 Starting minimal deployment to admin.funnelsynergy.io..."

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

# Step 3: Sync only essential files
echo -e "${YELLOW}📤 Syncing essential files...${NC}"

# Create a list of files to include
INCLUDE_DIRS=(
  "dist"
  "build"
  "public"
  "src"
)

INCLUDE_FILES=(
  "package.json"
  "package-lock.json"
  "ecosystem.config.js"
  "tsconfig.json"
  ".env"
)

# Sync each directory
for dir in "${INCLUDE_DIRS[@]}"; do
  if [ -d "$dir" ]; then
    echo -e "${YELLOW}Syncing $dir/ ...${NC}"
    sshpass -p "$SSH_PASSWORD" rsync -avz \
      --progress \
      --partial \
      --timeout=300 \
      --bwlimit=10000 \
      -e "ssh -p ${SERVER_PORT} -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -o ServerAliveInterval=30" \
      "$dir/" "${SERVER_USER}@${SERVER_HOST}:${SERVER_PATH}/$dir/"

    if [ $? -ne 0 ]; then
      echo -e "${RED}❌ Failed to sync $dir${NC}"
      exit 1
    fi
  fi
done

# Sync individual files
for file in "${INCLUDE_FILES[@]}"; do
  if [ -f "$file" ]; then
    echo -e "${YELLOW}Syncing $file ...${NC}"
    sshpass -p "$SSH_PASSWORD" rsync -avz \
      --timeout=300 \
      -e "ssh -p ${SERVER_PORT} -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null" \
      "$file" "${SERVER_USER}@${SERVER_HOST}:${SERVER_PATH}/"

    if [ $? -ne 0 ]; then
      echo -e "${RED}❌ Failed to sync $file${NC}"
      exit 1
    fi
  fi
done

echo -e "${GREEN}✅ Files synced successfully${NC}"

# Step 4: Install dependencies and restart on server
echo -e "${YELLOW}📦 Installing dependencies and restarting...${NC}"

sshpass -p "$SSH_PASSWORD" ssh -p ${SERVER_PORT} \
  -o StrictHostKeyChecking=no \
  -o UserKnownHostsFile=/dev/null \
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
    echo "Application restarted"
else
    echo "⚠️  PM2 not found. Please manually start the application."
fi

echo "✅ Deployment completed!"
ENDSSH

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Server setup failed.${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
echo -e "${GREEN}Your application should be running at: https://admin.funnelsynergy.io${NC}"
