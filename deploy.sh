#!/bin/bash

# Simple deployment script for Admin Portal to VM2
# Usage: ./deploy.sh

set -e

echo "🚀 Starting deployment to VM2..."
echo ""

# Configuration
VM2_IP="20.42.48.79"
VM2_USER="grp06admin"
VM2_PATH="~/healthcare-portal-frontend"

# Step 1: Build the frontend
echo "📦 Step 1/3: Building frontend..."
npm run build

if [ ! -d "dist" ]; then
    echo "❌ Error: dist folder not found. Build failed!"
    exit 1
fi

echo "✅ Build complete!"
echo ""

# Step 2: Upload to VM2
echo "📤 Step 2/3: Uploading to VM2..."
echo "You'll be prompted for password: Healthcare@Group06!"
echo ""

rsync -avz --delete dist/ ${VM2_USER}@${VM2_IP}:${VM2_PATH}/

if [ $? -eq 0 ]; then
    echo "✅ Upload complete!"
else
    echo "❌ Upload failed!"
    exit 1
fi

echo ""

# Step 3: Reload Nginx
echo "🔄 Step 3/3: Reloading Nginx on VM2..."
ssh ${VM2_USER}@${VM2_IP} "sudo systemctl reload nginx"

if [ $? -eq 0 ]; then
    echo "✅ Nginx reloaded!"
else
    echo "⚠️  Could not reload Nginx (you may need to do this manually)"
fi

echo ""
echo "🎉 Deployment complete!"
echo "🌐 Access your admin portal at: https://grp06healthapp.eastus.cloudapp.azure.com/admin"
echo ""
