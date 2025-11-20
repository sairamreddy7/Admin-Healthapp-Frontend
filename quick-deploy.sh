#!/bin/bash

# Quick deployment script for Admin Portal to VM2
# Usage: ./quick-deploy.sh

echo "🚀 Quick Deploy to VM2"
echo ""

# Build
echo "📦 Building..."
npm run build || { echo "❌ Build failed!"; exit 1; }

# Deploy
echo "📤 Uploading to VM2..."
echo "Password: Healthcare@Group06!"
scp -r dist/* grp06admin@20.42.48.79:~/healthcare-portal-frontend/

echo ""
echo "✅ Done! Check: http://20.42.48.79"
