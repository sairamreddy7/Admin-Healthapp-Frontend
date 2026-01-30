# 🚀 VM2 Deployment Instructions

## Option 1: Automated Deployment (Recommended)

Run the deployment script from your local machine:

```bash
./deploy.sh
```

**Note:** You'll be prompted for the VM2 SSH password.

---

## Option 2: Manual Deployment Steps

If you prefer to deploy manually, follow these steps:

### 1. SSH into VM2
```bash
ssh azureuser@grp06healthapp.eastus.cloudapp.azure.com
```

### 2. Navigate to Project Directory
```bash
cd /var/www/html/admin
```

### 3. Pull Latest Changes
```bash
git pull origin main
```

### 4. Install Dependencies
```bash
npm install
```

### 5. Configure for Production
```bash
# Uncomment base path in vite.config.js
sed -i "s|// base: '/admin/',|base: '/admin/',|g" vite.config.js

# Uncomment basename in App.jsx
sed -i 's|// basename="/admin"|basename="/admin"|g' src/App.jsx
```

### 6. Build Production Bundle
```bash
npm run build
```

### 7. Deploy Build Files
```bash
# Create deployment directory if it doesn't exist
sudo mkdir -p /var/www/html/admin_current

# Clear existing files
sudo rm -rf /var/www/html/admin_current/*

# Copy build files
sudo cp -r dist/* /var/www/html/admin_current/

# Set proper permissions
sudo chown -R www-data:www-data /var/www/html/admin_current/
sudo chmod -R 755 /var/www/html/admin_current/
```

### 8. Restart Web Server
```bash
# For Nginx
sudo systemctl restart nginx

# OR for Apache
# sudo systemctl restart apache2
```

### 9. Revert Config to Development Mode (Optional)
```bash
# Revert vite.config.js
sed -i "s|base: '/admin/',|// base: '/admin/',|g" vite.config.js

# Revert App.jsx
sed -i 's|basename="/admin"|// basename="/admin"|g' src/App.jsx
```

---

## ✅ Verification

After deployment, verify the admin portal is accessible at:

**🌐 https://grp06healthapp.eastus.cloudapp.azure.com/admin/**

### Test Checklist:
- [ ] Login page loads correctly
- [ ] Can log in with admin credentials
- [ ] Dashboard displays properly
- [ ] All navigation links work
- [ ] Data loads from VM4 backend
- [ ] Modern UI is visible

---

## 🔧 Troubleshooting

### Build Fails
- Check Node.js version: `node --version` (should be 18+)
- Clear node_modules: `rm -rf node_modules && npm install`
- Check for syntax errors in code

### 403/404 Errors After Deployment
- Verify nginx/apache configuration points to `/var/www/html/admin_current`
- Check file permissions: `ls -la /var/www/html/admin_current`
- Restart web server: `sudo systemctl restart nginx`

### Pages Not Loading
- Check browser console for errors (F12)
- Verify API URL in .env file
- Check if basename="/admin" is set in production build

---

## 📝 Quick Reference

**VM2 Details:**
- Host: `grp06healthapp.eastus.cloudapp.azure.com`
- User: `azureuser`
- Project Path: `/var/www/html/admin`
- Deployment Path: `/var/www/html/admin_current`
- Web Server: Nginx

**Admin Portal URL:**
- Production: `https://grp06healthapp.eastus.cloudapp.azure.com/admin/`

**Backend API (VM4):**
- `https://healthapp-beta.eastus.cloudapp.azure.com/api`

---

## 🎉 All Done!

Your modernized admin portal is now deployed with:
- ✨ Modern UI with gradient sidebar
- 🎨 Enhanced dashboard with quick actions
- 💊 Fixed prescriptions with doctor names
- 💰 Fixed billing statistics
- 🔐 Clickable user profile
- 📊 Better data display throughout
