#!/bin/bash

# Development build script for Android with local container APIs
# Similar to 'expo run:android' but with environment variables for local dev containers

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Building Android app in development mode...${NC}"
echo ""

# Get script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"-

# Check if we're in the app directory
if [ ! -d "android" ]; then
  echo -e "${RED}Error: android directory not found. Please run this script from the app directory.${NC}"
  exit 1
fi

# Get local IP address
# Try to get the IP address of the default network interface
LOCAL_IP=$(ip route get 1.1.1.1 2>/dev/null | grep -oP 'src \K\S+' || \
           ifconfig | grep -Eo 'inet (addr:)?([0-9]*\.){3}[0-9]*' | grep -Eo '([0-9]*\.){3}[0-9]*' | grep -v '127.0.0.1' | head -1 || \
           hostname -I | awk '{print $1}')

if [ -z "$LOCAL_IP" ]; then
  echo -e "${YELLOW}Warning: Could not detect local IP. Using localhost.${NC}"
  LOCAL_IP="localhost"
fi

# Set API URLs using local IP
API_BASE_URL="http://${LOCAL_IP}:3000"
CMS_BASE_URL="http://${LOCAL_IP}:5000"

# Set environment variables for local development
export EXPO_PUBLIC_API_BASE_URL="$API_BASE_URL"
export EXPO_PUBLIC_API_BASE_CMS_URL="$CMS_BASE_URL"
export EXPO_PUBLIC_PREDICTION_ENDPOINT=""
export EXPO_PUBLIC_ENV="development"

echo -e "${GREEN}Using local IP: ${LOCAL_IP}${NC}"
echo -e "${GREEN}API URL: ${API_BASE_URL}${NC}"
echo -e "${GREEN}CMS URL: ${CMS_BASE_URL}${NC}"
echo ""

# Navigate to Android directory and build
cd android
./gradlew assembleDebug

echo ""
echo -e "${GREEN}✓ Build completed!${NC}"
echo -e "${GREEN}APK: android/app/build/outputs/apk/debug/app-debug.apk${NC}"

