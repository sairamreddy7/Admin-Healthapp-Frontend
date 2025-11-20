#!/bin/bash

# VM2 Nginx Configuration Script for Admin Portal with SSL
# Run this script on VM2 after SSH connection

echo "🔧 Setting up Admin Portal with SSL Certificate"
echo ""

# Step 1: Install Certbot if not already installed
echo "📦 Installing Certbot..."
sudo apt update
sudo apt install certbot python3-certbot-nginx -y

# Step 2: Create Nginx configuration for admin subdomain
echo "📝 Creating Nginx configuration for admin.grp06healthapp.eastus.cloudapp.azure.com..."

sudo tee /etc/nginx/sites-available/admin-portal > /dev/null << 'EOF'
server {
    listen 80;
    server_name admin.grp06healthapp.eastus.cloudapp.azure.com;

    # Frontend - Admin Portal
    root /home/grp06admin/healthcare-portal-frontend;
    index index.html;

    # Main location for React app
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Static assets
    location /assets/ {
        alias /home/grp06admin/healthcare-portal-frontend/assets/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
EOF

# Step 3: Enable the site
echo "✅ Enabling admin portal site..."
sudo ln -sf /etc/nginx/sites-available/admin-portal /etc/nginx/sites-enabled/

# Step 4: Test Nginx configuration
echo "🧪 Testing Nginx configuration..."
sudo nginx -t

if [ $? -eq 0 ]; then
    echo "✅ Nginx configuration is valid!"
    
    # Reload Nginx
    echo "🔄 Reloading Nginx..."
    sudo systemctl reload nginx
    
    echo ""
    echo "✅ Nginx configured successfully!"
    echo ""
    echo "📋 NEXT STEPS:"
    echo "1. Configure Azure DNS A record for: admin.grp06healthapp.eastus.cloudapp.azure.com → 20.42.48.79"
    echo "2. Wait 5-10 minutes for DNS propagation"
    echo "3. Run this command to get SSL certificate:"
    echo ""
    echo "   sudo certbot --nginx -d admin.grp06healthapp.eastus.cloudapp.azure.com"
    echo ""
    echo "4. Certbot will automatically configure HTTPS and redirect HTTP to HTTPS"
    echo ""
else
    echo "❌ Nginx configuration test failed! Please check the errors above."
    exit 1
fi
