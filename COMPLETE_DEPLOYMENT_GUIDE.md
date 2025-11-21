# Complete Admin Portal Deployment Guide

## Overview

This document details the complete deployment process of the Healthcare Admin Portal to Azure VM2 with HTTPS/SSL configuration.

---

## Table of Contents

1. [Project Information](#project-information)
2. [Deployment Architecture](#deployment-architecture)
3. [Phase-by-Phase Deployment Process](#phase-by-phase-deployment-process)
4. [Technical Configuration Details](#technical-configuration-details)
5. [Troubleshooting Issues Encountered](#troubleshooting-issues-encountered)
6. [Final Deployment Verification](#final-deployment-verification)
7. [Future Maintenance](#future-maintenance)
8. [Quick Reference Commands](#quick-reference-commands)

---

## Project Information

### Repositories
- **Backend + Frontend Combined**: `sairamreddy7/admin-portal-healthcare`
- **Frontend Only (Deployed)**: `sairamreddy7/Admin-Healthapp-Frontend`
- **Decision**: Used frontend-only repository for cleaner CI/CD separation

### Technology Stack

**Frontend:**
- React 18.3.1
- Vite 7.2.4 (Build Tool)
- React Router v6 (Routing)
- Tailwind CSS v3 (Styling)
- Axios (HTTP Client)

**Backend:**
- Node.js with Express
- Prisma ORM
- PostgreSQL Database
- Already deployed by team member

**Infrastructure:**
- **Server**: Azure VM2 - Ubuntu Server 24.04 LTS
- **IP Address**: 20.42.48.79
- **Domain**: grp06healthapp.eastus.cloudapp.azure.com
- **Web Server**: Nginx 1.24.0
- **SSL**: Let's Encrypt (Certbot)
- **Credentials**: grp06admin / Healthcare@Group06!

---

## Deployment Architecture

### URL Structure

```
https://grp06healthapp.eastus.cloudapp.azure.com/
├── /                          → Patient/Doctor Portal (Root)
├── /login                     → Login Page (Patient/Doctor)
├── /admin                     → Admin Portal (NEW)
│   ├── /admin/login          → Admin Login
│   ├── /admin/dashboard      → Admin Dashboard
│   ├── /admin/users          → User Management
│   ├── /admin/doctors        → Doctor Management
│   └── /admin/patients       → Patient Management
└── /api                       → Backend API (Port 3000)
    ├── /api/auth             → Authentication endpoints
    ├── /api/users            → User endpoints
    ├── /api/doctors          → Doctor endpoints
    └── /api/patients         → Patient endpoints
```

### Path-Based Routing Strategy

**Why Path-Based Instead of Subdomain?**
- Azure DNS Label doesn't support subdomains without separate DNS Zone
- Shared SSL certificate (no additional certificate needed)
- Faster implementation
- No DNS propagation delays
- Easier maintenance

### Server Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    Internet (HTTPS)                     │
│            grp06healthapp.eastus.cloudapp.azure.com     │
└───────────────────────┬─────────────────────────────────┘
                        │
                        ├─ Port 443 (HTTPS)
                        │
┌───────────────────────▼─────────────────────────────────┐
│                  Nginx Web Server                        │
│              (SSL Certificate Handler)                   │
├──────────────────────────────────────────────────────────┤
│  Location /admin                                         │
│    → /var/www/admin-portal/index.html                   │
│    → Static Files (React SPA)                           │
├──────────────────────────────────────────────────────────┤
│  Location /                                              │
│    → /var/www/healthapp/index.html                      │
│    → Patient/Doctor Portal                              │
├──────────────────────────────────────────────────────────┤
│  Location /api                                           │
│    → Proxy to localhost:3000                            │
│    → Node.js Backend + Prisma + PostgreSQL              │
└──────────────────────────────────────────────────────────┘
```

---

## Phase-by-Phase Deployment Process

### Phase 1: Repository Setup & Decision (Nov 19, 2024)

**Initial Confusion:**
- Started with `admin-portal-healthcare` repository (contained both backend + frontend)
- Realized need for separate frontend-only deployment

**Decision Made:**
- Use `Admin-Healthapp-Frontend` repository for frontend deployment
- Keep `admin-portal-healthcare` for local development only
- Reason: Clean CI/CD separation, backend already deployed separately

**Actions:**
```bash
cd /Users/reethuchada/Documents/Admin-Healthapp-Frontend
git status
git remote -v
# Confirmed correct repository
```

---

### Phase 2: SSL/Domain Strategy Selection (Nov 19, 2024)

**Options Explored:**

**Option 1: Subdomain with Separate SSL Certificate**
- URL: `admin.grp06healthapp.eastus.cloudapp.azure.com`
- Requirements: Azure DNS Zone, Separate SSL certificate
- **Rejected**: DNS complexity, nslookup showed NXDOMAIN

**Option 2: Path-Based Routing (SELECTED ✅)**
- URL: `grp06healthapp.eastus.cloudapp.azure.com/admin`
- Benefits: Uses existing SSL, no DNS changes, faster deployment
- **Implementation**: Nginx location blocks

---

### Phase 3: Frontend Configuration for Path-Based Routing

**Step 3.1: Update Vite Configuration**

Modified `/Users/reethuchada/Documents/Admin-Healthapp-Frontend/vite.config.js`:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/admin/',  // Changed from '/'
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false
  },
  server: {
    port: 5173,
    host: true
  }
})
```

**Why?** Ensures all asset paths (CSS, JS, images) are prefixed with `/admin/`

**Step 3.2: Update React Router Configuration**

Modified `/Users/reethuchada/Documents/Admin-Healthapp-Frontend/src/main.jsx`:

```javascript
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename="/admin">  {/* Added basename */}
      <App />
    </BrowserRouter>
  </StrictMode>,
)
```

**Why?** Tells React Router all routes are under `/admin` base path

---

### Phase 4: Build Production Bundle

**Commands Executed:**

```bash
cd /Users/reethuchada/Documents/Admin-Healthapp-Frontend

# Clean node modules (due to previous corruption)
rm -rf node_modules package-lock.json

# Fresh install
npm install

# Build production bundle
npm run build
```

**Output:**
- Created `dist/` directory
- Generated optimized files:
  - `dist/index.html`
  - `dist/assets/index-LXM_Gq_r.css`
  - `dist/assets/index-TbLndo5p.js`
  - `dist/vite.svg`

**Build Settings:**
- Minified JavaScript
- CSS extracted and optimized
- Assets hashed for cache busting
- Source maps disabled for production

---

### Phase 5: Initial Deployment Attempt (Failed - 403 Error)

**Commands:**

```bash
# Upload to VM2 home directory
cd /Users/reethuchada/Documents/Admin-Healthapp-Frontend
scp -r dist/* grp06admin@20.42.48.79:~/healthcare-portal-frontend/

# SSH to VM2
ssh grp06admin@20.42.48.79

# On VM2: Update Nginx config
sudo nano /etc/nginx/sites-available/healthapp
```

**Nginx Configuration Added:**

```nginx
location /admin {
    alias /home/grp06admin/healthcare-portal-frontend;
    index index.html;
    try_files $uri $uri/ /admin/index.html;
}

location /admin/ {
    alias /home/grp06admin/healthcare-portal-frontend/;
    try_files $uri $uri/ /admin/index.html;
}
```

**Reload Nginx:**
```bash
sudo nginx -t
sudo systemctl reload nginx
```

**Result:** ❌ **403 Forbidden Error**

---

### Phase 6: Troubleshooting 403 Forbidden Error

**Problem Analysis:**
- Nginx runs as `www-data` user
- Files in `/home/grp06admin/` directory not accessible to `www-data`
- Permissions issue

**Solution:**
Move files to standard web directory `/var/www/`

**Commands Executed:**

```bash
# On VM2
ssh grp06admin@20.42.48.79

# Create proper web directory
sudo mkdir -p /var/www/admin-portal

# Copy files from local upload to temp location
cp -r ~/healthcare-portal-frontend/* ~/temp-admin/

# Move to web directory with proper ownership
sudo cp -r ~/temp-admin/* /var/www/admin-portal/
sudo chown -R www-data:www-data /var/www/admin-portal
sudo chmod -R 755 /var/www/admin-portal

# Verify
ls -la /var/www/admin-portal
```

**Update Nginx Configuration:**

```nginx
location /admin {
    alias /var/www/admin-portal;
    index index.html;
    try_files $uri $uri/ /admin/index.html;
}

location /admin/ {
    alias /var/www/admin-portal/;
    try_files $uri $uri/ /admin/index.html;
}
```

**Reload Nginx:**
```bash
sudo nginx -t
sudo systemctl reload nginx
```

**Result:** ✅ **403 Error Resolved** - But new issue appeared

---

### Phase 7: Troubleshooting Blank White Page

**Problem:**
- Browser showed blank white page
- Console error: `"No routes matched location '/admin/'"`
- JavaScript loaded correctly (proven by error appearing)

**Root Cause Analysis:**
- React Router received `/admin/` path
- But BrowserRouter had no `basename` prop
- Router thought base path was `/` not `/admin`

**Solution:**
Add `basename="/admin"` to BrowserRouter (already shown in Phase 3 Step 3.2)

**Commands to Fix:**

```bash
# On local machine
cd /Users/reethuchada/Documents/Admin-Healthapp-Frontend

# Edit src/main.jsx (add basename="/admin")
# Rebuild
npm run build

# Upload fixed build
scp -r dist/* grp06admin@20.42.48.79:~/temp-admin/

# On VM2
ssh grp06admin@20.42.48.79
sudo cp -r ~/temp-admin/* /var/www/admin-portal/
sudo chown -R www-data:www-data /var/www/admin-portal
```

**Result:** ✅ **Admin Portal Working!**

---

### Phase 8: GitHub Actions CI/CD Setup

**Created Workflow File:**

Location: `/Users/reethuchada/Documents/Admin-Healthapp-Frontend/.github/workflows/deploy.yml`

```yaml
name: Deploy to Azure VM2

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build frontend
      env:
        VITE_API_URL: ${{ secrets.VITE_API_URL }}
      run: npm run build
    
    - name: Upload to VM2
      uses: appleboy/scp-action@master
      with:
        host: ${{ secrets.VM2_HOST }}
        username: ${{ secrets.VM2_USERNAME }}
        password: ${{ secrets.VM2_PASSWORD }}
        source: "dist/*"
        target: "~/temp-admin/"
        strip_components: 1
    
    - name: Deploy on VM2
      uses: appleboy/ssh-action@master
      with:
        host: ${{ secrets.VM2_HOST }}
        username: ${{ secrets.VM2_USERNAME }}
        password: ${{ secrets.VM2_PASSWORD }}
        script: |
          sudo cp -r ~/temp-admin/* /var/www/admin-portal/
          sudo chown -R www-data:www-data /var/www/admin-portal
          sudo chmod -R 755 /var/www/admin-portal
          sudo nginx -t && sudo systemctl reload nginx
```

**GitHub Secrets Required:**
- `VM2_HOST`: 20.42.48.79
- `VM2_USERNAME`: grp06admin
- `VM2_PASSWORD`: Healthcare@Group06!
- `VITE_API_URL`: https://grp06healthapp.eastus.cloudapp.azure.com/api

**Status:** ⏳ Configured but awaiting manual secret addition by user

---

### Phase 9: Final Commit to GitHub

**Commands:**

```bash
cd /Users/reethuchada/Documents/Admin-Healthapp-Frontend

git add .
git commit -m "Fix: Add basename='/admin' to BrowserRouter for path-based routing"
git push origin main
```

**Commit Details:**
- Commit Hash: `ee2049e`
- Files Changed: 814 (including node_modules updates)
- Main Changes:
  - `src/main.jsx` - Added basename="/admin"
  - `dist/` - New production build
  - `configure-nginx-admin.sh` - Nginx automation script
  - `.github/workflows/deploy.yml` - CI/CD pipeline

---

### Phase 10: Documentation Creation

**Files Created:**

1. **SSL-DOMAIN-SETUP-GUIDE.md** - Complete SSL setup guide with both options
2. **AZURE-DNS-SETUP.md** - Azure DNS configuration instructions
3. **configure-nginx-admin.sh** - Automated Nginx configuration script
4. **deploy.sh** - Full deployment automation script
5. **quick-deploy.sh** - Quick manual deployment script

---

## Technical Configuration Details

### Complete Nginx Configuration

**File:** `/etc/nginx/sites-available/healthapp` on VM2

```nginx
server {
    listen 80;
    server_name grp06healthapp.eastus.cloudapp.azure.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name grp06healthapp.eastus.cloudapp.azure.com;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/grp06healthapp.eastus.cloudapp.azure.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/grp06healthapp.eastus.cloudapp.azure.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    # Admin Portal (NEW)
    location /admin {
        alias /var/www/admin-portal;
        index index.html;
        try_files $uri $uri/ /admin/index.html;
        
        # CORS headers if needed
        add_header 'Access-Control-Allow-Origin' '*' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;
        add_header 'Access-Control-Allow-Headers' 'Authorization, Content-Type' always;
    }

    location /admin/ {
        alias /var/www/admin-portal/;
        try_files $uri $uri/ /admin/index.html;
    }

    # Patient/Doctor Portal
    location / {
        root /var/www/healthapp;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # API Proxy
    location /api/ {
        proxy_pass http://localhost:3000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### File Permissions on VM2

```bash
# Admin Portal Directory
/var/www/admin-portal/
├── Owner: www-data:www-data
├── Permissions: 755 (drwxr-xr-x)
├── index.html (644)
├── vite.svg (644)
└── assets/
    ├── index-LXM_Gq_r.css (644)
    └── index-TbLndo5p.js (644)

# Nginx Configuration
/etc/nginx/sites-available/healthapp
├── Owner: root:root
├── Permissions: 644
└── Symlink: /etc/nginx/sites-enabled/healthapp
```

### Environment Variables

**Frontend (.env):**
```bash
VITE_API_URL=https://grp06healthapp.eastus.cloudapp.azure.com/api
```

**Build Time:**
- Hardcoded into JavaScript bundle during `npm run build`
- No runtime environment variable support in Vite

---

## Troubleshooting Issues Encountered

### Issue 1: Repository Confusion

**Problem:** GitHub Actions configured in wrong repository

**Symptoms:**
- Workflow in `admin-portal-healthcare` (backend + frontend)
- Confusion about which repo to use

**Solution:**
- Removed workflow from `admin-portal-healthcare`
- Kept in `Admin-Healthapp-Frontend` only
- Reason: Clean separation, backend shouldn't auto-deploy

---

### Issue 2: DNS Subdomain Not Working

**Problem:** `admin.grp06healthapp.eastus.cloudapp.azure.com` returned NXDOMAIN

**Diagnosis:**
```bash
nslookup admin.grp06healthapp.eastus.cloudapp.azure.com
# Result: NXDOMAIN (Non-existent domain)
```

**Root Cause:**
- Azure DNS Label doesn't support subdomains without separate DNS Zone
- Would require Azure DNS Zone setup ($0.50/month + configuration)

**Solution:**
- Switched to path-based routing (`/admin`)
- Uses existing SSL certificate
- No DNS configuration needed

---

### Issue 3: 403 Forbidden Error

**Problem:** Nginx returned 403 when accessing `/admin`

**Diagnosis:**
```bash
# Check Nginx error logs
sudo tail -f /var/log/nginx/error.log
# Error: Permission denied accessing /home/grp06admin/healthcare-portal-frontend
```

**Root Cause:**
- Files in `/home/grp06admin/` directory
- Nginx runs as `www-data` user
- `www-data` can't access user home directories

**Solution:**
```bash
# Move to standard web directory
sudo mkdir -p /var/www/admin-portal
sudo cp -r ~/temp-admin/* /var/www/admin-portal/
sudo chown -R www-data:www-data /var/www/admin-portal
sudo chmod -R 755 /var/www/admin-portal

# Update Nginx config to use /var/www/admin-portal
sudo nano /etc/nginx/sites-available/healthapp
sudo nginx -t
sudo systemctl reload nginx
```

---

### Issue 4: Blank White Page with "No routes matched" Error

**Problem:** Browser showed blank white page with console error

**Console Error:**
```
No routes matched location "/admin/"
```

**Diagnosis:**
- JavaScript loaded correctly (error proved this)
- Assets loaded fine (no 404s)
- React Router configuration issue

**Root Cause:**
- `vite.config.js` had `base: '/admin/'` ✅
- But `BrowserRouter` missing `basename="/admin"` ❌
- Router thought it was at root `/`, not `/admin`

**Solution:**
```javascript
// src/main.jsx - Add basename prop
<BrowserRouter basename="/admin">
  <App />
</BrowserRouter>
```

**Rebuild and Redeploy:**
```bash
npm run build
scp -r dist/* grp06admin@20.42.48.79:~/temp-admin/
ssh grp06admin@20.42.48.79
sudo cp -r ~/temp-admin/* /var/www/admin-portal/
```

**Result:** ✅ Working!

---

### Issue 5: Node Modules Corruption

**Problem:** `npm run build` failed with ERR_MODULE_NOT_FOUND

**Error:**
```
Error [ERR_MODULE_NOT_FOUND]: Cannot find module 'vite/bin/vite.js'
```

**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Reason:** Corrupted node_modules, clean reinstall fixed it

---

## Final Deployment Verification

### Testing Checklist

**✅ Admin Portal Access:**
- URL: https://grp06healthapp.eastus.cloudapp.azure.com/admin
- Login page loads correctly
- SSL certificate valid (Let's Encrypt)
- No console errors
- All assets load correctly

**✅ Routing Tests:**
- `/admin` redirects to `/admin/` (trailing slash added)
- `/admin/login` works
- `/admin/dashboard` works
- Direct URL navigation works
- Browser back/forward buttons work

**✅ Patient/Doctor Portal Unaffected:**
- URL: https://grp06healthapp.eastus.cloudapp.azure.com/
- `/login` page still works
- No interference with admin portal

**✅ Backend API:**
- URL: https://grp06healthapp.eastus.cloudapp.azure.com/api
- API endpoints responsive
- CORS headers working
- Authentication functional

**✅ SSL Certificate:**
- Valid certificate from Let's Encrypt
- Covers all paths (/admin, /, /api)
- No browser warnings
- HTTPS enforced (HTTP redirects to HTTPS)

---

## Future Maintenance

### Manual Deployment Process

When making changes to the frontend:

```bash
# 1. Make changes in local code
cd /Users/reethuchada/Documents/Admin-Healthapp-Frontend

# 2. Build production bundle
npm run build

# 3. Upload to VM2
scp -r dist/* grp06admin@20.42.48.79:~/temp-admin/

# 4. Deploy on VM2
ssh grp06admin@20.42.48.79
sudo cp -r ~/temp-admin/* /var/www/admin-portal/
sudo chown -R www-data:www-data /var/www/admin-portal
sudo chmod -R 755 /var/www/admin-portal

# 5. No need to reload Nginx for static files
```

### Automated Deployment (After Adding GitHub Secrets)

**One-Time Setup:**
1. Go to: https://github.com/sairamreddy7/Admin-Healthapp-Frontend/settings/secrets/actions
2. Add secrets:
   - `VM2_HOST`: 20.42.48.79
   - `VM2_USERNAME`: grp06admin
   - `VM2_PASSWORD`: Healthcare@Group06!
   - `VITE_API_URL`: https://grp06healthapp.eastus.cloudapp.azure.com/api

**Future Deployments:**
```bash
git add .
git commit -m "Your changes"
git push origin main
# GitHub Actions automatically deploys
```

### SSL Certificate Renewal

**Certificate Auto-Renewal:**
- Certbot automatically renews certificate
- Runs via systemd timer: `certbot.timer`
- Check status: `sudo systemctl status certbot.timer`

**Manual Renewal (if needed):**
```bash
ssh grp06admin@20.42.48.79
sudo certbot renew
sudo systemctl reload nginx
```

**Certificate Expiry Check:**
```bash
sudo certbot certificates
```

### Nginx Configuration Changes

**When to modify:**
- Adding new routes
- Changing proxy settings
- Updating CORS headers

**Process:**
```bash
ssh grp06admin@20.42.48.79
sudo nano /etc/nginx/sites-available/healthapp
# Make changes
sudo nginx -t  # Test configuration
sudo systemctl reload nginx  # Apply changes
```

### Monitoring & Logs

**Nginx Access Logs:**
```bash
sudo tail -f /var/log/nginx/access.log | grep "/admin"
```

**Nginx Error Logs:**
```bash
sudo tail -f /var/log/nginx/error.log
```

**Backend API Logs:**
```bash
# Check backend process (if using PM2)
pm2 logs
# Or check systemd service
sudo journalctl -u healthapp-backend -f
```

---

## Quick Reference Commands

### Local Development

```bash
# Start dev server
cd /Users/reethuchada/Documents/Admin-Healthapp-Frontend
npm run dev
# Access at: http://localhost:5173/admin

# Build production
npm run build

# Preview production build
npm run preview
```

### VM2 Access

```bash
# SSH to VM2
ssh grp06admin@20.42.48.79
# Password: Healthcare@Group06!

# Check Nginx status
sudo systemctl status nginx

# Test Nginx config
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx

# Restart Nginx
sudo systemctl restart nginx
```

### File Management on VM2

```bash
# Check admin portal files
ls -la /var/www/admin-portal/

# Check file permissions
ls -la /var/www/admin-portal/index.html

# Fix permissions if needed
sudo chown -R www-data:www-data /var/www/admin-portal
sudo chmod -R 755 /var/www/admin-portal
```

### Git Operations

```bash
cd /Users/reethuchada/Documents/Admin-Healthapp-Frontend

# Check status
git status

# Commit changes
git add .
git commit -m "Description of changes"
git push origin main

# Check last commits
git log --oneline -5
```

### Debugging

```bash
# Check if port 443 is open
sudo netstat -tulpn | grep :443

# Check SSL certificate
sudo certbot certificates

# Test HTTPS connection
curl -I https://grp06healthapp.eastus.cloudapp.azure.com/admin

# Check Nginx process
ps aux | grep nginx
```

---

## Timeline Summary

| Date | Phase | Status |
|------|-------|--------|
| Nov 19, 2024 | Repository setup & decision | ✅ Complete |
| Nov 19, 2024 | SSL/Domain strategy selection | ✅ Complete |
| Nov 19, 2024 | Frontend configuration (Vite + Router) | ✅ Complete |
| Nov 19, 2024 | Build production bundle | ✅ Complete |
| Nov 19, 2024 | Initial deployment (403 error) | ❌ Failed |
| Nov 19, 2024 | Fix 403 - Move to /var/www/ | ✅ Fixed |
| Nov 19, 2024 | Blank page - Add basename prop | ✅ Fixed |
| Nov 19, 2024 | GitHub Actions CI/CD setup | ⏳ Pending secrets |
| Nov 19, 2024 | Final commit to GitHub | ✅ Complete |
| Nov 19, 2024 | Documentation creation | ✅ Complete |

---

## Success Metrics

✅ **Admin portal live at:** https://grp06healthapp.eastus.cloudapp.azure.com/admin

✅ **SSL certificate working** - Let's Encrypt valid certificate

✅ **Patient/Doctor portal unaffected** - Still working at root path

✅ **Backend API functional** - Proxied at /api

✅ **No console errors** - Clean JavaScript execution

✅ **Routing works correctly** - All admin routes functional

✅ **CI/CD pipeline configured** - Ready for auto-deployment

✅ **Complete documentation** - Comprehensive guides created

---

## Key Learnings

1. **Path-based routing is simpler than subdomains** for Azure DNS Labels
2. **Always use /var/www/ for web content**, not home directories
3. **React Router requires both** `vite.config.js` base and `BrowserRouter` basename
4. **Nginx location blocks need careful** alias configuration for SPAs
5. **www-data user permissions** are critical for Nginx file access
6. **Clean node_modules** when encountering module resolution errors
7. **GitHub Actions with SCP** is effective for simple deployments
8. **Documentation is crucial** for future maintenance and team collaboration

---

## Contact & Support

**Server Access:**
- IP: 20.42.48.79
- Username: grp06admin
- Password: Healthcare@Group06!

**URLs:**
- Admin Portal: https://grp06healthapp.eastus.cloudapp.azure.com/admin
- Patient Portal: https://grp06healthapp.eastus.cloudapp.azure.com/
- API: https://grp06healthapp.eastus.cloudapp.azure.com/api

**GitHub Repository:**
- https://github.com/sairamreddy7/Admin-Healthapp-Frontend

---

## Appendix: Additional Scripts

### deploy.sh (Full Automation)

```bash
#!/bin/bash
cd /Users/reethuchada/Documents/Admin-Healthapp-Frontend
npm run build
scp -r dist/* grp06admin@20.42.48.79:~/temp-admin/
ssh grp06admin@20.42.48.79 << 'EOF'
  sudo cp -r ~/temp-admin/* /var/www/admin-portal/
  sudo chown -R www-data:www-data /var/www/admin-portal
  sudo chmod -R 755 /var/www/admin-portal
  echo "Deployment complete!"
EOF
```

### configure-nginx-admin.sh (Nginx Setup)

```bash
#!/bin/bash
sudo tee -a /etc/nginx/sites-available/healthapp > /dev/null <<'EOF'
    location /admin {
        alias /var/www/admin-portal;
        index index.html;
        try_files $uri $uri/ /admin/index.html;
    }

    location /admin/ {
        alias /var/www/admin-portal/;
        try_files $uri $uri/ /admin/index.html;
    }
EOF

sudo nginx -t && sudo systemctl reload nginx
echo "Nginx configured for /admin path!"
```

---

**End of Complete Deployment Guide**

*Last Updated: November 20, 2024*
*Version: 1.0*
*Status: Production Deployment Complete* ✅
