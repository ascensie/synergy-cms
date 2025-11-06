#!/bin/bash

# Script to manually setup SSH key on the server
# This adds your public key to the server's authorized_keys file

set -e

echo "🔑 Setting up SSH key authentication..."

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Configuration
SERVER_USER="funnelsynergy.io_twej7bvyil"
SERVER_HOST="admin.funnelsynergy.io"
SERVER_PORT="6040"
PUBLIC_KEY_PATH="$HOME/.ssh/id_rsa.pub"

# Check if public key exists
if [ ! -f "$PUBLIC_KEY_PATH" ]; then
    echo -e "${RED}❌ Public key not found at $PUBLIC_KEY_PATH${NC}"
    echo -e "${YELLOW}Generate one with: ssh-keygen -t rsa -b 4096${NC}"
    exit 1
fi

echo -e "${YELLOW}📋 Your public key:${NC}"
cat "$PUBLIC_KEY_PATH"
echo ""

echo -e "${YELLOW}📤 Copying SSH key to server...${NC}"
echo -e "${YELLOW}You will be prompted for your password${NC}"
echo ""

# Copy the key using SSH
cat "$PUBLIC_KEY_PATH" | ssh -p ${SERVER_PORT} ${SERVER_USER}@${SERVER_HOST} \
  "mkdir -p ~/.ssh && chmod 700 ~/.ssh && cat >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys && echo 'Key added successfully'"

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅ SSH key installed successfully!${NC}"
    echo ""
    echo -e "${YELLOW}Testing connection without password...${NC}"

    # Test the connection
    ssh -p ${SERVER_PORT} -o BatchMode=yes ${SERVER_USER}@${SERVER_HOST} "echo 'SSH key authentication works!'"

    if [ $? -eq 0 ]; then
        echo -e "${GREEN}🎉 Perfect! You can now deploy without entering a password${NC}"
        echo -e "${GREEN}Run: ./deploy-with-key.sh${NC}"
    else
        echo -e "${YELLOW}⚠️  Key installed but test failed. Try manually: ssh -p ${SERVER_PORT} ${SERVER_USER}@${SERVER_HOST}${NC}"
    fi
else
    echo -e "${RED}❌ Failed to install SSH key${NC}"
    exit 1
fi
