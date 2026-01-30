#!/bin/bash

# Admin Portal Deployment Script for VM2
# Run this script to deploy the latest changes to the production server

set -e  # Exit on error

echo "🚀 Starting Admin Portal Deployment to VM2..."
echo "================================================"

# VM Configuration
VM_HOST="grp06healthapp.eastus.cloudapp.azure.com"
VM_USER="azureuser"
VM_PATH="/var/www/html/admin"
WEB_SERVER="nginx"  # Change to "apache" if using Apache

echo ""
echo "📋 Deployment Steps:"
echo "1. SSH into VM2"
echo "2. Pull latest code from Git"
echo "3. Install dependencies"
echo "4. Build production bundle"
echo "5. Deploy to web server"
echo ""

# SSH into VM and execute deployment commands
ssh ${VM_USER}@${VM_HOST} << 'ENDSSH'
    echo "✅ Connected to VM2"
    
    # Navigate to project directory
    cd /var/www/html/admin || { echo "❌ Project directory not found!"; exit 1; }
    echo "📁 Current directory: $(pwd)"
    
    # Pull latest changes
    echo ""
    echo "📥 Pulling latest changes from Git..."
    git pull origin main || { echo "❌ Git pull failed!"; exit 1; }
    echo "✅ Latest code pulled successfully"
    
    # Install dependencies
    echo ""
    echo "📦 Installing dependencies..."
    npm install || { echo "❌ npm install failed!"; exit 1; }
    echo "✅ Dependencies installed"
    
    # Modify vite.config.js for production (uncomment base path)
    echo ""
    echo "⚙️  Configuring for production..."
    sed -i "s|// base: '/admin/',|base: '/admin/',|g" vite.config.js
    sed -i "s|//base: '/admin/',|base: '/admin/',|g" vite.config.js
    echo "✅ vite.config.js configured"
    
    # Modify App.jsx for production (uncomment basename)
    sed -i 's|// basename="/admin"|basename="/admin"|g' src/App.jsx
    sed -i 's|//basename="/admin"|basename="/admin"|g' src/App.jsx
    echo "✅ App.jsx configured"
    
    # Build production bundle
    echo ""
    echo "🔨 Building production bundle..."
    npm run build || { echo "❌ Build failed!"; exit 1; }
    echo "✅ Build completed successfully"
    
    # Backup current deployment (optional)
    echo ""
    echo "💾 Creating backup of current deployment..."
    if [ -d "dist_backup" ]; then
        rm -rf dist_backup_old
        mv dist_backup dist_backup_old
    fi
    
    if [ -d "../admin_current" ]; then
        cp -r ../admin_current dist_backup
        echo "✅ Backup created"
    else
        echo "ℹ️  No previous deployment to backup"
    fi
    
    # Deploy the build
    echo ""
    echo "🚀 Deploying to web server..."
    
    # Copy build files to web server directory
    sudo rm -rf ../admin_current/*
    sudo cp -r dist/* ../admin_current/ || { echo "❌ Deployment failed!"; exit 1; }
    
    # Set proper permissions
    sudo chown -R www-data:www-data ../admin_current/
    sudo chmod -R 755 ../admin_current/
    
    echo "✅ Files deployed successfully"
    
    # Restart web server
    echo ""
    echo "🔄 Restarting web server..."
    sudo systemctl restart nginx || sudo systemctl restart apache2
    echo "✅ Web server restarted"
    
    # Revert config files back to development mode
    echo ""
    echo "🔧 Reverting config to development mode..."
    sed -i "s|base: '/admin/',|// base: '/admin/',|g" vite.config.js
    sed -i 's|basename="/admin"|// basename="/admin"|g' src/App.jsx
    echo "✅ Config reverted for development"
    
    echo ""
    echo "================================================"
    echo "🎉 Deployment completed successfully!"
    echo "================================================"
    echo ""
    echo "📍 Admin Portal URL: https://grp06healthapp.eastus.cloudapp.azure.com/admin/"
    echo ""
    
ENDSSH

echo ""
echo "✅ Deployment script completed!"
echo ""
echo "🌐 Your admin portal is now live at:"
echo "   https://grp06healthapp.eastus.cloudapp.azure.com/admin/"
echo ""
