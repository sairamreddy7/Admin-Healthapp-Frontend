#!/bin/bash

# Quick Setup: Admin Portal at /admin path with existing SSL
# Run this script on VM2

echo "🚀 Setting up Admin Portal at /admin with SSL"
echo ""

# Backup existing config
echo "📦 Backing up existing configuration..."
sudo cp /etc/nginx/sites-available/healthapp /etc/nginx/sites-available/healthapp.backup

# Update healthapp config to include /admin
echo "📝 Updating Nginx configuration..."

sudo tee /etc/nginx/sites-available/healthapp > /dev/null << 'EOF'
server {
    server_name grp06healthapp.eastus.cloudapp.azure.com;

    # Patient/Doctor Portal (existing)
    root /var/www/healthapp/frontend/dist;
    index index.html;

    # Admin Portal - NEW!
    location /admin {
        alias /home/grp06admin/healthcare-portal-frontend;
        index index.html;
        try_files $uri $uri/ /admin/index.html;
        
        # Add trailing slash redirect
        rewrite ^/admin$ /admin/ permanent;
    }

    # Admin Portal assets
    location /admin/assets/ {
        alias /home/grp06admin/healthcare-portal-frontend/assets/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Serve the React/Vite app (Patient/Doctor portal)
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Proxy API requests to Node backend
    location /api/ {
        proxy_pass         http://127.0.0.1:3000/api/;
        proxy_http_version 1.1;
        proxy_set_header   Upgrade $http_upgrade;
        proxy_set_header   Connection "upgrade";
        proxy_set_header   Host $host;
        proxy_set_header   X-Real-IP $remote_addr;
        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
    }

    add_header X-Content-Type-Options nosniff;
    add_header X-Frame-Options SAMEORIGIN;
    add_header X-XSS-Protection "1; mode=block";

    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/grp06healthapp.eastus.cloudapp.azure.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/grp06healthapp.eastus.cloudapp.azure.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
}

server {
    if ($host = grp06healthapp.eastus.cloudapp.azure.com) {
        return 301 https://$host$request_uri;
    }

    listen 80;
    server_name grp06healthapp.eastus.cloudapp.azure.com;
    return 404;
}
EOF

# Set proper permissions
echo "🔒 Setting permissions..."
chmod -R 755 /home/grp06admin/healthcare-portal-frontend
chmod 755 /home/grp06admin

# Test configuration
echo "🧪 Testing Nginx configuration..."
sudo nginx -t

if [ $? -eq 0 ]; then
    echo "✅ Configuration is valid!"
    
    # Reload Nginx
    echo "🔄 Reloading Nginx..."
    sudo systemctl reload nginx
    
    echo ""
    echo "✅ ADMIN PORTAL IS NOW LIVE WITH SSL!"
    echo ""
    echo "🌐 Access at: https://grp06healthapp.eastus.cloudapp.azure.com/admin"
    echo "🔒 SSL: Enabled (using existing certificate)"
    echo ""
    echo "⚠️  IMPORTANT: You need to rebuild frontend with base path '/admin/'"
    echo "    Update vite.config.js: base: '/admin/'"
    echo "    Run: npm run build"
    echo "    Upload new dist files to VM2"
    echo ""
else
    echo "❌ Configuration test failed!"
    echo "Restoring backup..."
    sudo cp /etc/nginx/sites-available/healthapp.backup /etc/nginx/sites-available/healthapp
    sudo systemctl reload nginx
    exit 1
fi
